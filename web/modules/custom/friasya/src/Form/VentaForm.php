<?php

namespace Drupal\friasya\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\node\Entity\Node;
use Drupal\taxonomy\Entity\Term;

class VentaForm extends FormBase {

  public function getFormId() {
    return 'friasya_venta_form';
  }

  public function buildForm(array $form, FormStateInterface $form_state) {
    $form['producto'] = [
      '#type' => 'entity_autocomplete',
      '#title' => $this->t('Producto'),
      '#target_type' => 'node',
      '#selection_settings' => ['target_bundles' => ['p']],
      '#required' => TRUE,
    ];

    $form['cantidad'] = [
      '#type' => 'number',
      '#title' => $this->t('Cantidad'),
      '#default_value' => 1,
      '#min' => 1,
      '#required' => TRUE,
    ];

    $form['metodo_pago'] = [
      '#type' => 'select',
      '#title' => $this->t('Método de pago'),
      '#options' => $this->getMetodosDePagoOptions(),
      '#required' => TRUE,
    ];

    $form['direccion'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Dirección de entrega'),
      '#required' => TRUE,
    ];

    $form['submit'] = [
      '#type' => 'submit',
      '#value' => $this->t('Crear transacción'),
      '#attributes' => ['class' => ['btn-friasya']],
    ];

    return $form;
  }

  public function submitForm(array &$form, FormStateInterface $form_state) {
    $producto_nid = $form_state->getValue('producto');
    $cantidad = $form_state->getValue('cantidad');
    $metodo_tid = $form_state->getValue('metodo_pago');
    $direccion = $form_state->getValue('direccion');

    $node = Node::create([
      'type' => 'transacion',
      'title' => 'Compra de producto',
      'field_productos' => ['target_id' => $producto_nid],
      'field_cantidad' => $cantidad,
      'field_metodo_pago' => ['target_id' => $metodo_tid],
      'body' => [
        'value' => $direccion,
        'format' => 'basic_html',
      ],
    ]);
    $node->save();

    $this->messenger()->addStatus($this->t('Transacción creada correctamente.'));
    $form_state->setRedirect('<front>');
  }

  protected function getMetodosDePagoOptions() {
    $options = [];
    $terms = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadTree('metodos_de_pago');
    foreach ($terms as $term) {
      $options[$term->tid] = $term->name;
    }
    return $options;
  }
}
