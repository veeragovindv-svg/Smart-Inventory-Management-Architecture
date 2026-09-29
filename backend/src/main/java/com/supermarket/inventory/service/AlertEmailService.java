package com.supermarket.inventory.service;

import com.supermarket.inventory.dto.PredictionResponseDTO;
import com.supermarket.inventory.entity.Product;
import com.supermarket.inventory.entity.PurchaseOrder;
import com.supermarket.inventory.entity.Supplier;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class AlertEmailService {

    private final JavaMailSender mailSender;

    public void sendLowStockAlert(Product product, PredictionResponseDTO forecast) {
        Supplier supplier = product.getSupplier();
        String supplierName = supplier != null ? supplier.getName() : "Assigned Supplier";

        String subject = String.format("ALERT: Low Stock Warning - %s (Run-out in %.1f days)", product.getName(), forecast.getDaysUntilDepletion());
        String body = String.format(
            "SUPERMARKET INVENTORY SYSTEM ALERT\n" +
            "===================================\n" +
            "Product: %s\n" +
            "Barcode: %s\n" +
            "Current Stock: %d units\n" +
            "Min Safety Buffer: %d units\n" +
            "Predicted Daily Demand: %.1f units/day\n" +
            "Estimated Run-Out Date: %s\n\n" +
            "Supplier: %s\n" +
            "Lead Time: %d days\n" +
            "Recommended Reorder Quantity: %d units\n\n" +
            "Action Required: Please click 'Send PO' on your Manager Dashboard to trigger automated restock order.",
            product.getName(),
            product.getBarcode(),
            product.getCurrentStock(),
            product.getMinThreshold(),
            forecast.getPredictedDailyDemand(),
            forecast.getPredictedRunOutDate(),
            supplierName,
            supplier != null ? supplier.getLeadTimeDays() : 2,
            forecast.getReorderQuantitySuggested()
        );

        log.warn("STOCKS CRITICAL: Triggering Alert Email for product: {}", product.getName());
        sendEmailSilently(product.getSupplier() != null ? product.getSupplier().getContactEmail() : "manager@supermarket.com", subject, body);
    }

    public void sendPurchaseOrderToSupplier(PurchaseOrder po) {
        Supplier supplier = po.getSupplier();
        Product product = po.getProduct();

        String subject = String.format("PURCHASE ORDER #PO-%d - %s", po.getPoId(), product.getName());
        String body = String.format(
            "OFFICIAL PURCHASE ORDER\n" +
            "========================\n" +
            "PO Number: PO-%d\n" +
            "Date: %s\n\n" +
            "To: %s (%s)\n\n" +
            "Order Details:\n" +
            "Item: %s (Barcode: %s)\n" +
            "Quantity Ordered: %d units\n" +
            "Target Delivery: Within %d days\n\n" +
            "Please confirm receipt of this purchase order and reply with estimated dispatch time.\n\n" +
            "Thank you,\nSupermarket Procurement Team",
            po.getPoId(),
            po.getCreatedAt(),
            supplier.getName(),
            supplier.getContactEmail(),
            product.getName(),
            product.getBarcode(),
            po.getOrderQuantity(),
            supplier.getLeadTimeDays()
        );

        log.info("SENDING PURCHASE ORDER EMAIL TO SUPPLIER: {}", supplier.getContactEmail());
        sendEmailSilently(supplier.getContactEmail(), subject, body);
    }

    private void sendEmailSilently(String to, String subject, String text) {
        try {
            SimpleMailMessage message = new SimpleMailMessage();
            message.setTo(to);
            message.setSubject(subject);
            message.setText(text);
            mailSender.send(message);
            log.info("Email sent successfully to {}", to);
        } catch (Exception e) {
            log.warn("Mock Email Dispatch Log (SMTP server not connected, logging email body to console):\n[TO: {}]\n[SUBJECT: {}]\n{}", to, subject, text);
        }
    }
}
