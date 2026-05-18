import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faImage,
  faPlus,
  faUpload,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import GameHeader from "../components/GameHeader";
import { supabase } from "../utils/supabase";
import "../styles/menuRecuerdos.css";

const BUCKET_NAME = "user-images";
const SIGNED_URL_SECONDS = 3600;
const UNCATEGORIZED_ID = "sin-categoria";
const initialUploadForm = {
  title: "",
  description: "",
  categoryId: "",
  file: null,
};

function createStoragePath(userId, file) {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  return `${userId}/${Date.now()}-${safeName}`;
}

function getCategory(image) {
  return {
    id: image.category?.id ?? UNCATEGORIZED_ID,
    name: image.category?.name ?? "Sin categoria",
  };
}

export default function MenuRecuerdos() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [uploadForm, setUploadForm] = useState(initialUploadForm);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadImages() {
      setLoading(true);
      setError("");

      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!active) return;

      if (!session) {
        navigate("/auth", { replace: true });
        return;
      }

      const { data: categoriesData, error: categoriesError } = await supabase
        .schema("reminisi")
        .from("image_categories")
        .select("id, name")
        .order("name", { ascending: true });

      if (!active) return;

      if (categoriesError) {
        setError(categoriesError.message);
        setLoading(false);
        return;
      }

      const { data, error: imagesError } = await supabase
        .schema("reminisi")
        .from("user_images")
        .select(
          "id, title, description, bucket_name, file_path, category:image_categories(id, name)",
        )
        .eq("user_id", session.user.id)
        .eq("bucket_name", BUCKET_NAME)
        .order("created_at", { ascending: false });

      if (!active) return;

      if (imagesError) {
        setError(imagesError.message);
        setLoading(false);
        return;
      }

      const signedImages = await Promise.all(
        (data ?? []).map(async (image) => {
          const { data: signedData, error: signedError } =
            await supabase.storage
              .from(BUCKET_NAME)
              .createSignedUrl(image.file_path, SIGNED_URL_SECONDS);

          return {
            ...image,
            category: Array.isArray(image.category)
              ? image.category[0]
              : image.category,
            imageUrl: signedData?.signedUrl ?? "",
            imageError: signedError?.message ?? "",
          };
        }),
      );

      if (!active) return;

      const categoryIds = [
        ...new Set([
          ...(categoriesData ?? []).map((category) => category.id),
          ...signedImages.map((image) => getCategory(image).id),
        ]),
      ];

      setCategories(categoriesData ?? []);
      setImages(signedImages);
      setSelectedCategories(categoryIds);
      setLoading(false);
    }

    loadImages();

    return () => {
      active = false;
    };
  }, [navigate]);

  const filterCategories = useMemo(() => {
    const categoriesMap = new Map();

    categories.forEach((category) => {
      categoriesMap.set(category.id, category);
    });

    images.forEach((image) => {
      const category = getCategory(image);
      categoriesMap.set(category.id, category);
    });

    return [...categoriesMap.values()].sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [categories, images]);

  const visibleImages = useMemo(
    () =>
      images.filter((image) =>
        selectedCategories.includes(getCategory(image).id),
      ),
    [images, selectedCategories],
  );

  function toggleCategory(categoryId) {
    setSelectedCategories((currentCategories) =>
      currentCategories.includes(categoryId)
        ? currentCategories.filter((id) => id !== categoryId)
        : [...currentCategories, categoryId],
    );
  }

  function openUploadModal() {
    setUploadForm((currentForm) => ({
      ...currentForm,
      categoryId: currentForm.categoryId || categories[0]?.id || "",
    }));
    setUploadError("");
    setIsUploadModalOpen(true);
  }

  function closeUploadModal() {
    if (uploading) return;
    setIsUploadModalOpen(false);
    setUploadForm(initialUploadForm);
    setUploadError("");
  }

  function handleUploadFormChange(event) {
    const { name, value, files } = event.target;

    setUploadForm((currentForm) => ({
      ...currentForm,
      [name]: files ? files[0] : value,
    }));
  }

  async function handleUploadSubmit(event) {
    event.preventDefault();

    if (uploading) return;

    const title = uploadForm.title.trim();
    const description = uploadForm.description.trim();

    if (!title) {
      setUploadError("El titulo es obligatorio.");
      return;
    }

    if (!uploadForm.categoryId) {
      setUploadError("Selecciona una categoria.");
      return;
    }

    if (!uploadForm.file) {
      setUploadError("Selecciona una foto.");
      return;
    }

    if (!uploadForm.file.type.startsWith("image/")) {
      setUploadError("El archivo seleccionado debe ser una imagen.");
      return;
    }

    setUploading(true);
    setUploadError("");

    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      navigate("/auth", { replace: true });
      return;
    }

    const filePath = createStoragePath(session.user.id, uploadForm.file);

    const { error: storageError } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, uploadForm.file, {
        contentType: uploadForm.file.type,
        upsert: false,
      });

    if (storageError) {
      setUploadError(storageError.message);
      setUploading(false);
      return;
    }

    const { data: insertedImage, error: insertError } = await supabase
      .schema("reminisi")
      .from("user_images")
      .insert({
        user_id: session.user.id,
        category_id: uploadForm.categoryId,
        title,
        description,
        bucket_name: BUCKET_NAME,
        file_path: filePath,
      })
      .select(
        "id, title, description, bucket_name, file_path, category:image_categories(id, name)",
      )
      .single();

    if (insertError) {
      await supabase.storage.from(BUCKET_NAME).remove([filePath]);
      setUploadError(insertError.message);
      setUploading(false);
      return;
    }

    const { data: signedData, error: signedError } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(filePath, SIGNED_URL_SECONDS);

    const newImage = {
      ...insertedImage,
      category: Array.isArray(insertedImage.category)
        ? insertedImage.category[0]
        : insertedImage.category,
      imageUrl: signedData?.signedUrl ?? "",
      imageError: signedError?.message ?? "",
    };

    setImages((currentImages) => [newImage, ...currentImages]);
    setSelectedCategories((currentCategories) =>
      currentCategories.includes(uploadForm.categoryId)
        ? currentCategories
        : [...currentCategories, uploadForm.categoryId],
    );
    setUploading(false);
    setIsUploadModalOpen(false);
    setUploadForm(initialUploadForm);
  }

  return (
    <div className="recuerdos-container">
      <GameHeader title="Mis recuerdos" />

      <div className="recuerdos-toolbar">
        <button
          type="button"
          className="add-memory-button"
          onClick={openUploadModal}
        >
          <FontAwesomeIcon icon={faPlus} />
          Añadir imagen
        </button>
      </div>

      {loading && <p className="recuerdos-message">Cargando recuerdos...</p>}

      {error && !loading && (
        <p className="recuerdos-message" role="alert">
          Error al cargar los recuerdos: {error}
        </p>
      )}

      {!loading && !error && (
        <>
          {filterCategories.length > 0 && (
            <section
              className="categories-panel"
              aria-label="Filtrar recuerdos por categoria"
            >
              {filterCategories.map((category) => (
                <label className="category-check" key={category.id}>
                  <input
                    type="checkbox"
                    checked={selectedCategories.includes(category.id)}
                    onChange={() => toggleCategory(category.id)}
                  />
                  <span>{category.name}</span>
                </label>
              ))}
            </section>
          )}

          {images.length === 0 && (
            <p className="recuerdos-message">
              Aun no hay imagenes para mostrar.
            </p>
          )}

          {images.length > 0 && visibleImages.length === 0 && (
            <p className="recuerdos-message">
              No hay imagenes en las categorias seleccionadas.
            </p>
          )}

          {visibleImages.length > 0 && (
            <div className="memories-grid">
              {visibleImages.map((image) => {
                const category = getCategory(image);

                return (
                  <article className="recuerdo-card" key={image.id}>
                    {image.imageUrl ? (
                      <img
                        src={image.imageUrl}
                        alt={image.title || "Recuerdo"}
                      />
                    ) : (
                      <div className="recuerdo-image-fallback">
                        <FontAwesomeIcon icon={faImage} />
                      </div>
                    )}

                    <div className="recuerdo-card-content">
                      <span className="recuerdo-category">{category.name}</span>
                      <h2>{image.title || "Recuerdo sin titulo"}</h2>
                      {image.description && <p>{image.description}</p>}
                      {image.imageError && (
                        <p className="recuerdo-card-error">
                          No se pudo cargar la imagen.
                        </p>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </>
      )}

      {isUploadModalOpen && (
        <div className="memory-modal-backdrop" role="presentation">
          <div
            className="memory-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="memory-modal-title"
          >
            <div className="memory-modal-header">
              <div>
                <h2 id="memory-modal-title">Añadir imagen</h2>
                <p>Completa los datos del recuerdo.</p>
              </div>
              <button
                type="button"
                className="close-memory-modal"
                aria-label="Cerrar ventana"
                onClick={closeUploadModal}
                disabled={uploading}
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            <form className="memory-upload-form" onSubmit={handleUploadSubmit}>
              <label htmlFor="memory-title">Titulo</label>
              <input
                id="memory-title"
                type="text"
                name="title"
                value={uploadForm.title}
                onChange={handleUploadFormChange}
                disabled={uploading}
                required
              />

              <label htmlFor="memory-description">Descripcion</label>
              <textarea
                id="memory-description"
                name="description"
                value={uploadForm.description}
                onChange={handleUploadFormChange}
                rows="4"
                disabled={uploading}
              />

              <label htmlFor="memory-category">Categoria</label>
              <select
                id="memory-category"
                name="categoryId"
                value={uploadForm.categoryId}
                onChange={handleUploadFormChange}
                disabled={uploading || categories.length === 0}
                required
              >
                {categories.length === 0 ? (
                  <option value="">No hay categorias disponibles</option>
                ) : (
                  categories.map((category) => (
                    <option value={category.id} key={category.id}>
                      {category.name}
                    </option>
                  ))
                )}
              </select>

              <label htmlFor="memory-file">Foto</label>
              <label className="file-upload-box" htmlFor="memory-file">
                <FontAwesomeIcon icon={faUpload} />
                <span>
                  {uploadForm.file
                    ? uploadForm.file.name
                    : "Seleccionar imagen"}
                </span>
                <input
                  id="memory-file"
                  type="file"
                  name="file"
                  accept="image/*"
                  onChange={handleUploadFormChange}
                  disabled={uploading}
                  required
                />
              </label>

              {uploadError && (
                <p className="memory-upload-error" role="alert">
                  {uploadError}
                </p>
              )}

              <div className="memory-modal-actions">
                <button
                  type="button"
                  className="cancel-memory-button"
                  onClick={closeUploadModal}
                  disabled={uploading}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="save-memory-button"
                  disabled={uploading || categories.length === 0}
                >
                  {uploading ? "Guardando..." : "Guardar"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
