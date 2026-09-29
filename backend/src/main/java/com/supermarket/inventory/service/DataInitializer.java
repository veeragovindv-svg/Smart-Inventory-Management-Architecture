package com.supermarket.inventory.service;

import com.supermarket.inventory.entity.*;
import com.supermarket.inventory.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Random;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements CommandLineRunner {

    private final SupplierRepository supplierRepository;
    private final ProductRepository productRepository;
    private final SalesTransactionRepository salesTransactionRepository;

    @Override
    public void run(String... args) throws Exception {
        if (supplierRepository.count() > 0) {
            log.info("Database already seeded.");
            return;
        }

        log.info("Seeding initial Supermarket Suppliers, 12 Reference Store Products, Expiry Dates, and Sales History...");

        Supplier s1 = supplierRepository.save(Supplier.builder()
                .name("Fresh Dairy Farms Ltd.")
                .contactEmail("orders@freshdairy.com")
                .phone("+91-9876543210")
                .leadTimeDays(2)
                .build());

        Supplier s2 = supplierRepository.save(Supplier.builder()
                .name("Golden Grain Bakers")
                .contactEmail("procurement@goldengrain.com")
                .phone("+91-9876543211")
                .leadTimeDays(1)
                .build());

        Supplier s3 = supplierRepository.save(Supplier.builder()
                .name("Sunrise Poultry & Eggs")
                .contactEmail("sales@sunrisepoultry.com")
                .phone("+91-9876543212")
                .leadTimeDays(3)
                .build());

        Supplier s4 = supplierRepository.save(Supplier.builder()
                .name("Himalayan Beverages & Snacks")
                .contactEmail("orders@himalayanbev.com")
                .phone("+91-9876543213")
                .leadTimeDays(2)
                .build());

        Supplier s5 = supplierRepository.save(Supplier.builder()
                .name("Apex HomeCare Essentials")
                .contactEmail("supply@apexhomecare.com")
                .phone("+91-9876543214")
                .leadTimeDays(4)
                .build());

        LocalDate today = LocalDate.now();

        Product p1 = productRepository.save(Product.builder()
                .barcode("8901001001")
                .name("Fresh Whole Milk 1L")
                .category("Dairy")
                .currentStock(35)
                .minThreshold(20)
                .unitPrice(60.0)
                .expiryDate(today.plusDays(4).toString())
                .supplier(s1)
                .build());

        Product p2 = productRepository.save(Product.builder()
                .barcode("8901001002")
                .name("Whole Wheat Bread 400g")
                .category("Bakery")
                .currentStock(18)
                .minThreshold(15)
                .unitPrice(45.0)
                .expiryDate(today.plusDays(2).toString())
                .supplier(s2)
                .build());

        Product p3 = productRepository.save(Product.builder()
                .barcode("8901001003")
                .name("Farm Fresh Eggs (Pack of 12)")
                .category("Poultry")
                .currentStock(85)
                .minThreshold(25)
                .unitPrice(90.0)
                .expiryDate(today.plusDays(18).toString())
                .supplier(s3)
                .build());

        Product p4 = productRepository.save(Product.builder()
                .barcode("8901001004")
                .name("Cheddar Cheese Slice 200g")
                .category("Dairy")
                .currentStock(12)
                .minThreshold(15)
                .unitPrice(140.0)
                .expiryDate(today.plusDays(25).toString())
                .supplier(s1)
                .build());

        Product p5 = productRepository.save(Product.builder()
                .barcode("8901001005")
                .name("Organic Basmati Rice 5kg")
                .category("Staples")
                .currentStock(60)
                .minThreshold(20)
                .unitPrice(450.0)
                .expiryDate(today.plusDays(180).toString())
                .supplier(s4)
                .build());

        Product p6 = productRepository.save(Product.builder()
                .barcode("8901001006")
                .name("Sparkling Orange Soda 1.5L")
                .category("Beverages")
                .currentStock(42)
                .minThreshold(18)
                .unitPrice(85.0)
                .expiryDate(today.plusDays(90).toString())
                .supplier(s4)
                .build());

        Product p7 = productRepository.save(Product.builder()
                .barcode("8901001007")
                .name("Crunchy Potato Chips 150g")
                .category("Snacks")
                .currentStock(95)
                .minThreshold(30)
                .unitPrice(40.0)
                .expiryDate(today.plusDays(120).toString())
                .supplier(s4)
                .build());

        Product p8 = productRepository.save(Product.builder()
                .barcode("8901001008")
                .name("Anti-Bacterial Dishwash Gel 500ml")
                .category("Household")
                .currentStock(28)
                .minThreshold(15)
                .unitPrice(115.0)
                .expiryDate(today.plusDays(365).toString())
                .supplier(s5)
                .build());

        Product p9 = productRepository.save(Product.builder()
                .barcode("8901001009")
                .name("Herbal Moisturizing Soap 125g")
                .category("Personal Care")
                .currentStock(70)
                .minThreshold(25)
                .unitPrice(55.0)
                .expiryDate(today.plusDays(365).toString())
                .supplier(s5)
                .build());

        Product p10 = productRepository.save(Product.builder()
                .barcode("8901001010")
                .name("Greek Yogurt Blueberry 150g")
                .category("Dairy")
                .currentStock(10)
                .minThreshold(15)
                .unitPrice(75.0)
                .expiryDate(today.plusDays(3).toString())
                .supplier(s1)
                .build());

        Product p11 = productRepository.save(Product.builder()
                .barcode("8901001011")
                .name("Premium Filter Coffee Powder 250g")
                .category("Beverages")
                .currentStock(32)
                .minThreshold(12)
                .unitPrice(195.0)
                .expiryDate(today.plusDays(150).toString())
                .supplier(s4)
                .build());

        Product p12 = productRepository.save(Product.builder()
                .barcode("8901001012")
                .name("Multigrain Digestive Biscuits 300g")
                .category("Snacks")
                .currentStock(55)
                .minThreshold(20)
                .unitPrice(65.0)
                .expiryDate(today.plusDays(90).toString())
                .supplier(s2)
                .build());

        // Generate past 14 days of realistic sales history
        Random rand = new Random();
        LocalDateTime now = LocalDateTime.now();

        for (Product product : Arrays.asList(p1, p2, p3, p4, p5, p6, p7, p8, p9, p10, p11, p12)) {
            int baseSales = product.getCategory().equals("Dairy") ? 22 : product.getCategory().equals("Snacks") ? 18 : 12;
            for (int day = 14; day >= 1; day--) {
                int dailyQty = baseSales + rand.nextInt(10) - 3;
                salesTransactionRepository.save(SalesTransaction.builder()
                        .product(product)
                        .quantitySold(Math.max(2, dailyQty))
                        .unitPrice(product.getUnitPrice())
                        .transactionDate(now.minusDays(day))
                        .build());
            }
        }

        log.info("Supermarket Database successfully populated with 12 reference store products!");
    }
}
