package com.mycompany.myapp.repository;

import com.mycompany.myapp.domain.Responsable;
import org.springframework.data.jpa.repository.*;
import org.springframework.stereotype.Repository;

/**
 * Spring Data JPA repository for the Responsable entity.
 */
@SuppressWarnings("unused")
@Repository
public interface ResponsableRepository extends JpaRepository<Responsable, Long> {}
