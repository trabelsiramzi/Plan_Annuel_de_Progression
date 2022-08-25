package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Entretien;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Entretien entity.
 */
@SuppressWarnings("unused")
@Repository
public interface EntretienRepository extends JpaRepository<Entretien, Long> {}
