<?php

namespace Drupal\friasya\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\friasya\Form\VentaForm;

/**
 * Controlador de la ruta /agregar/venta.
 */
class VentaController extends ControllerBase {
  public function build() {
    return [
      '#theme' => 'friasya_form_venta',
      '#form' => \Drupal::formBuilder()->getForm(VentaForm::class),
      '#attached' => [
        'library' => [
          // Puedes definir una librería si luego necesitas CSS separado.
        ],
      ],
    ];
  }
}
