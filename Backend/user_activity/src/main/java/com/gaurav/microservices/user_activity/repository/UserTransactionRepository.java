package com.gaurav.microservices.user_activity.repository;

import com.gaurav.microservices.user_activity.entity.UserTransactionEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface UserTransactionRepository extends JpaRepository<UserTransactionEntity, Long> {
    // You can add custom query methods here as needed
}