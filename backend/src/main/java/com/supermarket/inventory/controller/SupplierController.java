package com.supermarket.inventory.controller;

import com.supermarket.inventory.entity.Supplier;
import com.supermarket.inventory.repository.SupplierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/suppliers")
@CrossOrigin(origins = "*")
@RequiredArgsConstructor
public class SupplierController {

    private final SupplierRepository supplierRepository;

    @GetMapping
    public List<Supplier> getAllSuppliers() {
        return supplierRepository.findAll();
    }

    @PostMapping
    public Supplier createSupplier(@RequestBody Supplier supplier) {
        return supplierRepository.save(supplier);
    }
}
