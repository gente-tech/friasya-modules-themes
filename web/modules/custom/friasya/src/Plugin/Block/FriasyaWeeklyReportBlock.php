<?php

namespace Drupal\friasya\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;

/**
 * Proporciona un bloque de gestión semanal de ventas y stock.
 *
 * @Block(
 *   id = "friasya_weekly_report_block",
 *   admin_label = @Translation("Reporte de stock (Friasya)")
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

    $ventas = [];

    // Inicializar datos por producto
    foreach ($productos as $producto) {
      $stock = (int) $producto->get('field_stock')->value;
      $nombre = $producto->label();
      $stock_maximo = (stripos($nombre, 'club colombia') !== false) ? 16 : 24;
      $ventas[$producto->id()] = [
        'nombre' => $nombre,
        'stock' => $stock,
        'a_retanquear' => max(0, $stock_maximo - $stock),
      ];
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
