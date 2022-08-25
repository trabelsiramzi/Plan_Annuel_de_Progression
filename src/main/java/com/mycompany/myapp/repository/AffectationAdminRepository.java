package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.AffectationAdmin;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the AffectationAdmin entity.
 */
@SuppressWarnings("unused")
@Repository
public interface AffectationAdminRepository extends JpaRepository<AffectationAdmin, Long> {}
