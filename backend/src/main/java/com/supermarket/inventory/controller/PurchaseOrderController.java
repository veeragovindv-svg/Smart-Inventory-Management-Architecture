package com.supermarket.inventory.controller;

import com.supermarket.inventory.dto.PoRequestDTO;
import com.supermarket.inventory.entity.Product;
import com.supermarket.inventory.entity.PurchaseOrder;
import com.supermarket.inventory.entity.Supplier;
import com.supermarket.inventory.repository.ProductRepository;
import com.supermarket.inventory.repository.PurchaseOrderRepository;
import com.supermarket.inventory.repository.SupplierRepository;
import com.supermarket.inventory.service.AlertEmailService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/po")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class PurchaseOrderController {

    private final PurchaseOrderRepository purchaseOrderRepository;
    private final ProductRepository productRepository;
    private final SupplierRepository supplierRepository;
    private final AlertEmailService alertEmailService;

    @GetMapping
    public List<PurchaseOrder> getAllOrders() {
        return purchaseOrderRepository.findAll();
    }

    @PostMapping("/trigger")
    public ResponseEntity<?> triggerPurchaseOrder(@RequestBody PoRequestDTO request) {
        Optional<Product> optionalProduct = productRepository.findById(request.getProductId());
        if (optionalProduct.isEmpty()) {
            return ResponseEntity.badRequest().body("Invalid Product ID");
        }

        Product product = optionalProduct.get();
        Supplier supplier = product.getSupplier();
        if (request.getSupplierId() != null) {
            supplier = supplierRepository.findById(request.getSupplierId()).orElse(supplier);
        }

        if (supplier == null) {
            return ResponseEntity.badRequest().body("No supplier assigned for product");
        }

        int qty = request.getOrderQuantity() != null ? request.getOrderQuantity() : 50;

        PurchaseOrder po = PurchaseOrder.builder()
                .product(product)
                .supplier(supplier)
                .orderQuantity(qty)
                .status("SENT")
                .createdAt(LocalDateTime.now())
                .build();

        PurchaseOrder savedPo = purchaseOrderRepository.save(po);

        // Send email to supplier
        alertEmailService.sendPurchaseOrderToSupplier(savedPo);

        return ResponseEntity.ok(Map.of(
                "message", "Purchase order successfully placed & sent to supplier",
                "purchaseOrder", savedPo
        ));
    }

    @PostMapping("/{id}/fulfill")
    public ResponseEntity<?> fulfillPurchaseOrder(@PathVariable Long id) {
        Optional<PurchaseOrder> optionalPo = purchaseOrderRepository.findById(id);
        if (optionalPo.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        PurchaseOrder po = optionalPo.get();
        if ("FULFILLED".equalsIgnoreCase(po.getStatus())) {
            return ResponseEntity.badRequest().body("Purchase order is already fulfilled.");
        }

        po.setStatus("FULFILLED");
        PurchaseOrder updatedPo = purchaseOrderRepository.save(po);

        // Automatically add received stock quantity to product inventory
        Product product = po.getProduct();
        product.setCurrentStock(product.getCurrentStock() + po.getOrderQuantity());
        productRepository.save(product);

        return ResponseEntity.ok(Map.of(
                "message", "Purchase order fulfilled! Inventory stock auto-restocked.",
                "purchaseOrder", updatedPo,
                "newProductStock", product.getCurrentStock()
        ));
    }
}
