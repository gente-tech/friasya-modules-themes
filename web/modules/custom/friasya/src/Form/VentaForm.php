<?php

namespace Drupal\friasya\Form;

use Drupal\Core\Form\FormBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\node\Entity\Node;
use Drupal\taxonomy\Entity\Term;

/**
 * Formulario personalizado para crear una transacción de venta.
 */
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
    $cantidad = (int) $form_state->getValue('cantidad');
    $metodo_tid = $form_state->getValue('metodo_pago');
    $direccion = $form_state->getValue('direccion');

    // Obtener valor unitario desde field_precio.
    $producto = Node::load($producto_nid);
    $valor_unitario = 0;
    if ($producto && $producto->hasField('field_precio') && !$producto->get('field_precio')->isEmpty()) {
      $valor_unitario = (int) $producto->get('field_precio')->value;
    }

    $valor_total = $valor_unitario * $cantidad;

    // Crear nodo tipo transacion.
    $node = Node::create([
      'type' => 'transacion',
      'title' => 'Compra de producto',
      'field_productos' => ['target_id' => $producto_nid],
      'field_cantidad' => $cantidad,
      'field_valor' => $valor_total,
      'field_metodo_de_pago' => [['target_id' => $metodo_tid]],
      'field_tipo' => [['target_id' => $this->getTermIdByName('Ingreso', 't')]], // ← Aquí se corrigió
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

  protected function getTermIdByName($name, $vocab) {
    $terms = \Drupal::entityTypeManager()->getStorage('taxonomy_term')->loadByProperties([
      'name' => $name,
      'vid' => $vocab,
    ]);
    $term = reset($terms);
    return $term ? $term->id() : NULL;
  }
}


