package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Projet;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Projet}.
 */
public interface ProjetService {
    /**
     * Save a projet.
     *
     * @param projet the entity to save.
     * @return the persisted entity.
     */
    Projet save(Projet projet);

    /**
     * Updates a projet.
     *
     * @param projet the entity to update.
     * @return the persisted entity.
     */
    Projet update(Projet projet);

    /**
     * Partially updates a projet.
     *
     * @param projet the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Projet> partialUpdate(Projet projet);

    /**
     * Get all the projets.
     *
     * @return the list of entities.
     */
    List<Projet> findAll();

    /**
     * Get the "id" projet.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Projet> findOne(Long id);

    /**
     * Delete the "id" projet.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
