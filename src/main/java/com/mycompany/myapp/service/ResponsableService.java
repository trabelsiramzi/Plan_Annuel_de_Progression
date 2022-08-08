package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.Responsable;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link Responsable}.
 */
public interface ResponsableService {
    /**
     * Save a responsable.
     *
     * @param responsable the entity to save.
     * @return the persisted entity.
     */
    Responsable save(Responsable responsable);

    /**
     * Updates a responsable.
     *
     * @param responsable the entity to update.
     * @return the persisted entity.
     */
    Responsable update(Responsable responsable);

    /**
     * Partially updates a responsable.
     *
     * @param responsable the entity to update partially.
     * @return the persisted entity.
     */
    Optional<Responsable> partialUpdate(Responsable responsable);

    /**
     * Get all the responsables.
     *
     * @return the list of entities.
     */
    List<Responsable> findAll();

    /**
     * Get the "id" responsable.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<Responsable> findOne(Long id);

    /**
     * Delete the "id" responsable.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
