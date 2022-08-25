package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Entretien;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Entretien}.
 */
public interface EntretienService {
    /**
     * Save a entretien.
     *
     * @param entretien the entity to save.
     * @return the persisted entity.
     */
    Entretien save(Entretien entretien);

    /**
     * Updates a entretien.
     *
     * @param entretien the entity to update.
     * @return the persisted entity.
     */
    Entretien update(Entretien entretien);

    /**
     * Partially updates a entretien.
     *
     * @param entretien the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Entretien> partialUpdate(Entretien entretien);

    /**
     * Get all the entretiens.
     *
     * @return the list of entities.
     */
    List<Entretien> findAll();

    /**
     * Get the "id" entretien.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Entretien> findOne(Long id);

    /**
     * Delete the "id" entretien.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
