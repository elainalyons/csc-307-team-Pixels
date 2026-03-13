import React, {
  useEffect,
  useMemo,
  useRef,
  useState
} from "react";
import "./DailyPhotos.css";
import cameraIcon from "./assets/icons/cameraVec.svg";
import settingIcon from "./assets/icons/settingIcon.svg";

import t1 from "./assets/templates/template1.jpg";
import t2 from "./assets/templates/template2.jpg";
import t3 from "./assets/templates/template3.jpg";
import t4 from "./assets/templates/template4.jpg";

const TEMPLATES = [t1, t2, t3, t4];

export default function DailyPhotos({
  uploadPhotos = [],
  selectedTemplates = [],

  onAddFiles,
  onRemoveUploadAtIndex,
  onToggleTemplate,
  onClearAll
}) {
  const rootRef = useRef(null);
  const fileRef = useRef(null);

  const [menuOpen, setMenuOpen] = useState(false);
  const [showTemplatePicker, setShowTemplatePicker] =
    useState(false);

  const hasPhotos =
    uploadPhotos.length > 0 || selectedTemplates.length > 0;

  const display = useMemo(() => {
    return [...selectedTemplates, ...uploadPhotos].slice(0, 4);
  }, [selectedTemplates, uploadPhotos]);

  useEffect(() => {
    function onDocMouseDown(e) {
      if (!menuOpen) return;
      if (!rootRef.current) return;

      if (!rootRef.current.contains(e.target)) {
        setMenuOpen(false);
        setShowTemplatePicker(false);
      }
    }

    document.addEventListener("mousedown", onDocMouseDown);
    return () =>
      document.removeEventListener("mousedown", onDocMouseDown);
  }, [menuOpen]);

  useEffect(() => {
    function onKeyDown(e) {
      if (!menuOpen) return;
      if (e.key === "Escape") {
        setMenuOpen(false);
        setShowTemplatePicker(false);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () =>
      document.removeEventListener("keydown", onKeyDown);
  }, [menuOpen]);

  const openUploadPicker = () => {
    setMenuOpen(false);
    setShowTemplatePicker(false);
    fileRef.current?.click();
  };

  const openTemplates = () => {
    setShowTemplatePicker(true);
  };

  const clearAll = () => {
    onClearAll?.();
    setMenuOpen(false);
    setShowTemplatePicker(false);
  };

  return (
    <section className="photosBlock" ref={rootRef}>
      <input
        ref={fileRef}
        className="photosInputHidden"
        type="file"
        accept="image/*"
        multiple
        onChange={onAddFiles}
      />

      {/* Clickable frame */}
      <div
        className={`photosFrame ${hasPhotos ? "hasPhotos" : ""}`}
        role="button"
        tabIndex={0}
        aria-label="Pictures"
        onClick={() => setMenuOpen((v) => !v)}
        onMouseLeave={() => {
          setMenuOpen(false);
          setShowTemplatePicker(false);
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ")
            setMenuOpen((v) => !v);
        }}>
        {/* Empty state overlay */}
        {!hasPhotos && (
          <div className="photosEmpty">
            <img
              className="cameraIcon"
              src={cameraIcon}
              alt=""
              aria-hidden="true"
            />
          </div>
        )}

        {/* Photos grid */}
        {hasPhotos && (
          <div className="photosGrid">
            {display.map((src, i) => {
              const isTemplate =
                selectedTemplates.includes(src);

              return (
                <div className="photoCard" key={`${src}-${i}`}>
                  <img
                    className="photoImg"
                    src={src}
                    alt="Daily"
                  />

                  {/* remove on hover:
                      - templates remove by toggling template
                      - uploads remove by upload index */}
                  <button
                    type="button"
                    className="photoRemove"
                    onClick={(e) => {
                      e.stopPropagation();

                      if (isTemplate) {
                        onToggleTemplate(src);
                        return;
                      }

                      // src is an upload => find its index in uploadPhotos
                      const uploadIndex =
                        uploadPhotos.indexOf(src);
                      if (uploadIndex !== -1)
                        onRemoveUploadAtIndex(uploadIndex);
                    }}
                    aria-label="Remove photo"
                    title="Remove">
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* Popover menu */}
        {menuOpen && (
          <div
            className="photosMenu"
            onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              className="menuItem"
              onClick={openUploadPicker}>
              Upload
            </button>

            <button
              type="button"
              className="menuItem"
              onClick={openTemplates}>
              Templates
            </button>

            <button
              type="button"
              className="menuItem danger"
              onClick={clearAll}>
              Clear
            </button>

            {/* Template picker is inside the popover (temporary) */}
            {showTemplatePicker && (
              <div className="templatePicker">
                {TEMPLATES.map((src, i) => {
                  const selected =
                    selectedTemplates.includes(src);

                  const totalSelected =
                    selectedTemplates.length +
                    uploadPhotos.length;
                  const disabled =
                    !selected && totalSelected >= 4;

                  return (
                    <button
                      key={i}
                      type="button"
                      className={`templateCard ${selected ? "selected" : ""}`}
                      onClick={() => onToggleTemplate(src)}
                      disabled={disabled}
                      title={
                        disabled
                          ? "Max 4 total images"
                          : "Toggle template"
                      }>
                      <img
                        className="photoImg"
                        src={src}
                        alt="Template"
                      />
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
