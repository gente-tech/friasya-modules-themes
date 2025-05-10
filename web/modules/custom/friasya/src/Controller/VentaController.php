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
      '#form' => \Drupal::formBuilder()->getForm('Drupal\friasya\Form\VentaForm'),
      '#attached' => [
        'library' => ['friasya/form_venta'],
      ],
    ];
  }

}
