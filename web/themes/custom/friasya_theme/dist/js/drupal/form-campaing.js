(function (Drupal) {
  Drupal.behaviors.customFileUploadStyling = {
    attach: function (context, settings) {
      // Seleccionar elementos .form-managed-file en el contexto actual
      const elements = context.querySelectorAll(".form-item-facturas .form-managed-file");

      // Verificar si se ha alcanzado el límite de archivos (5 archivos)
      const totalFilesUploaded = document.querySelectorAll(
        ".form-item-facturas .form-managed-file .js-form-type-checkbox"
      ).length;
      const maxFiles = 5;
      const limitReached = totalFilesUploaded >= maxFiles;

      elements.forEach((element) => {
        const hasRemoveButton = element.querySelector(
          '[data-drupal-selector$="-remove-button"]'
        );
        const fileInput = element.querySelector('input[type="file"]');
        const existingWrapper = element.querySelector(".wrapper-custom-buttons");
        const uploadButton = element.querySelector(".button--primary");

        // 1. Lógica para agregar/remover el wrapper
        if (!hasRemoveButton || !limitReached) {
          // Solo agregar el wrapper si no hay botón de eliminación y no se ha alcanzado el límite
          if (!existingWrapper) {
            // Crea la estructura personalizada
            const padre = document.createElement("div");
            padre.classList.add("wrapper-custom-buttons");

            // Columna izquierda
            const div1 = document.createElement("div");
            div1.classList.add("column-left");
            const textoP = document.createElement("p");
            textoP.textContent = "seleccionar archivos";
            div1.append(textoP);

            // Columna derecha
            const div2 = document.createElement("div");
            div2.classList.add("column-right");
            const btnCTA = document.createElement("p");
            btnCTA.classList.add("custom-button-upload-file");
            btnCTA.textContent = "ningún archivo seleccionado";
            div2.append(btnCTA);

            // Agregar al contenedor padre
            padre.append(div1, div2);

            // Insertar el wrapper después del input file (primer input)
            if (fileInput) {
              fileInput.parentNode.insertBefore(padre, fileInput.nextSibling);
            } else {
              // Si por alguna razón no hay input file, lo añadimos al final del elemento
              element.appendChild(padre);
            }

            // Agregar event listener al div1 para activar el input file
            div1.addEventListener("click", function () {
              fileInput?.click();
            });

            // Si hay un cambio en el input file, actualizar el texto
            if (fileInput) {
              fileInput.addEventListener("change", function () {
                const btnCTA = padre.querySelector(".custom-button-upload-file");
                if (btnCTA && this.files.length > 0) {
                  btnCTA.textContent = this.files[0].name;
                }
              });
            }
          }
        } else {
          // Eliminar el wrapper si hay botón de eliminación o se alcanzó el límite
          const facturasInput = document.querySelector(".facturas_input");
          facturasInput.style.marginTop = "0.5rem";

          if (existingWrapper) {
            existingWrapper.remove();
          }
        }

        // Lógica para las clases CSS en .form-managed-file
        const removeClass = hasRemoveButton ? "no-file-custom" : "load-file-custom";
        const addClass = hasRemoveButton ? "load-file-custom" : "no-file-custom";
        element.classList.remove(removeClass);
        element.classList.add(addClass);

        // Si se ha alcanzado el límite, deshabilitar los inputs de archivo restantes
        if (limitReached && !hasRemoveButton) {
          if (fileInput) {
            fileInput.disabled = true;
          }
          if (uploadButton) {
            uploadButton.disabled = true;
          }
        }
      });
    },
  };
})(Drupal);
