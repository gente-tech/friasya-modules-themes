<?php

namespace Drupal\friasya\EventSubscriber;

use Symfony\Component\EventDispatcher\EventSubscriberInterface;
use Drupal\node\NodeInterface;
use Drupal\node\NodeEvents;
use Drupal\node\Event\NodeInsertEvent;
use Drupal\Core\Entity\EntityTypeManagerInterface;

class NodeInsertSubscriber implements EventSubscriberInterface {

  protected $entityTypeManager;

  public function __construct(EntityTypeManagerInterface $entityTypeManager) {
    $this->entityTypeManager = $entityTypeManager;
  }

  public static function getSubscribedEvents() {
    return [
      NodeEvents::INSERT => 'onNodeInsert',
    ];
  }

  public function onNodeInsert(NodeInsertEvent $event) {
    $node = $event->getNode();

    // Solo si es del tipo "venta"
    if ($node->bundle() === 'venta') {
      if ($node->hasField('field_producto') && !$node->get('field_producto')->isEmpty()) {
        $producto_nid = $node->get('field_producto')->target_id;
        $cantidad = $node->hasField('field_cantidad') ? (int) $node->get('field_cantidad')->value : 1;

        $producto = $this->entityTypeManager
          ->getStorage('node')
          ->load($producto_nid);

        if ($producto && $producto->bundle() === 'producto') {
          if ($producto->hasField('field_stock')) {
            $stock_actual = (int) $producto->get('field_stock')->value;
            $producto->set('field_stock', max(0, $stock_actual - $cantidad));
            $producto->save();
          }
        }
      }
    }
  }
}
