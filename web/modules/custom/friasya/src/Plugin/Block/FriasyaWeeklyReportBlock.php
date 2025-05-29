<?php

namespace Drupal\friasya\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Database\Connection;
use Drupal\node\Entity\Node;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;

/**
 * Proporciona un bloque de gestión semanal de ventas y stock.
 *
 * @Block(
 *   id = "friasya_weekly_report_block",
 *   admin_label = @Translation("Reporte semanal de ventas y stock (Friasya)")
 * )
 */
class FriasyaWeeklyReportBlock extends BlockBase implements ContainerFactoryPluginInterface {

  protected $entityTypeManager;

  public function __construct(array $configuration, $plugin_id, $plugin_definition, EntityTypeManagerInterface $entityTypeManager) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
    $this->entityTypeManager = $entityTypeManager;
  }

  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('entity_type.manager')
    );
  }

  public function build() {
    $productos = $this->entityTypeManager->getStorage('node')->loadByProperties(['type' => 'p']);
    $transacciones = $this->entityTypeManager->getStorage('node')->loadByProperties(['type' => 'transacion']);

    $inicio_semana = strtotime('monday this week');
    $fin_semana = strtotime('sunday this week');

    $ventas = [];

    // Inicializar datos por producto
    foreach ($productos as $producto) {
      $ventas[$producto->id()] = [
        'nombre' => $producto->label(),
        'stock' => $producto->get('field_stock')->value,
        'precio' => $producto->get('field_precio')->value,
        'vendido' => 0,
      ];
    }

    // Acumular unidades vendidas esta semana
    foreach ($transacciones as $trans) {
      $created = $trans->getCreatedTime();
      if ($created >= $inicio_semana && $created <= $fin_semana) {
        foreach ($trans->get('field_productos') as $item) {
          $target = $item->target_id;
          $cantidad = $item->get('target_revision_id') ? 1 : 1;
          if (isset($ventas[$target])) {
            $ventas[$target]['vendido'] += $cantidad;
          }
        }
      }
    }

    return [
      '#theme' => 'friasya_weekly_report',
      '#productos' => $ventas,
      '#attached' => [
        'library' => [
          'friasya/weekly_report',
        ],
      ],
    ];
  }
}
