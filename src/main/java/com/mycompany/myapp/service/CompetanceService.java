package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Competance;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Competance}.
 */
public interface CompetanceService {
    /**
     * Save a competance.
     *
     * @param competance the entity to save.
     * @return the persisted entity.
     */
    Competance save(Competance competance);

    /**
     * Updates a competance.
     *
     * @param competance the entity to update.
     * @return the persisted entity.
     */
    Competance update(Competance competance);

    /**
     * Partially updates a competance.
     *
     * @param competance the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Competance> partialUpdate(Competance competance);

    /**
     * Get all the competances.
     *
     * @return the list of entities.
     */
    List<Competance> findAll();

    /**
     * Get the "id" competance.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Competance> findOne(Long id);

    /**
     * Delete the "id" competance.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
