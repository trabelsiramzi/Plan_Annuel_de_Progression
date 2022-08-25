package com.mycompany.myapp.service;

import com.mycompany.myapp.domain.AffectationAdmin;
import java.util.List;
import java.util.Optional;

/**
 * Service Interface for managing {@link AffectationAdmin}.
 */
public interface AffectationAdminService {
    /**
     * Save a affectationAdmin.
     *
     * @param affectationAdmin the entity to save.
     * @return the persisted entity.
     */
    AffectationAdmin save(AffectationAdmin affectationAdmin);

    /**
     * Updates a affectationAdmin.
     *
     * @param affectationAdmin the entity to update.
     * @return the persisted entity.
     */
    AffectationAdmin update(AffectationAdmin affectationAdmin);

    /**
     * Partially updates a affectationAdmin.
     *
     * @param affectationAdmin the entity to update partially.
     * @return the persisted entity.
     */
    Optional<AffectationAdmin> partialUpdate(AffectationAdmin affectationAdmin);

    /**
     * Get all the affectationAdmins.
     *
     * @return the list of entities.
     */
    List<AffectationAdmin> findAll();

    /**
     * Get the "id" affectationAdmin.
     *
     * @param id the id of the entity.
     * @return the entity.
     */
    Optional<AffectationAdmin> findOne(Long id);

    /**
     * Delete the "id" affectationAdmin.
     *
     * @param id the id of the entity.
     */
    void delete(Long id);
}
