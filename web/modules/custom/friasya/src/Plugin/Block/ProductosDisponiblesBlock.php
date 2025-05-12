<?php

namespace Drupal\friasya\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\node\Entity\Node;

/**
 * Provides a block to mostrar productos disponibles.
 *
 * @Block(
 *   id = "productos_disponibles_block",
 *   admin_label = @Translation("Productos disponibles (Friasya)"),
 * )
 */
class ProductosDisponiblesBlock extends BlockBase {

  public function build() {
    $query = \Drupal::entityTypeManager()->getStorage('node')->getQuery();
    $nids = $query
      ->condition('type', 'p')
      ->condition('status', 1)
      ->exists('field_stock')
      ->exists('field_precio')
      ->condition('field_stock', 1, '>')
      ->execute();

    $productos = Node::loadMultiple($nids);

    $items = [];
    foreach ($productos as $producto) {
      $items[] = [
        'nid' => $producto->id(),
        'title' => $producto->label(),
        'precio' => $producto->get('field_precio')->value,
        'imagen_url' => $producto->get('field_imagen')->entity?->createFileUrl() ?? '',
      ];
    }

    return [
      '#theme' => 'productos_disponibles',
      '#productos' => $items,
      '#attached' => [
        'library' => [
          'friasya/productos',
        ],
      ],
    ];
  }
}
