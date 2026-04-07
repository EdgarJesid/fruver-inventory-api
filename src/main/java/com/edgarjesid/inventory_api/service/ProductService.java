package com.edgarjesid.inventory_api.service;

import com.edgarjesid.inventory_api.model.Product;
import com.edgarjesid.inventory_api.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class ProductService {


    private final ProductRepository repository;

    public ProductService(ProductRepository repository) {
        this.repository = repository;
    }

    public List<Product> getAll(){
        return repository.findAll();
    }

    public Optional<Product> getById(Long id){
        return repository.findById(id);
    }

    public Product save(Product product) {
        return repository.save(product);
    }

    public void delete(Long id){
        repository.deleteById(id);
    }
}
