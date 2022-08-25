package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.AffectationAdmin;
import com.mycompany.myapp.repository.AffectationAdminRepository;
import com.mycompany.myapp.service.AffectationAdminService;
import com.mycompany.myapp.web.rest.errors.BadRequestAlertException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import tech.jhipster.web.util.HeaderUtil;
import tech.jhipster.web.util.ResponseUtil;

/**
 * REST controller for managing {@link com.mycompany.myapp.domain.AffectationAdmin}.
 */
@RestController
@RequestMapping("/api")
public class AffectationAdminResource {

    private final Logger log = LoggerFactory.getLogger(AffectationAdminResource.class);

    private static final String ENTITY_NAME = "affectationAdmin";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final AffectationAdminService affectationAdminService;

    private final AffectationAdminRepository affectationAdminRepository;

    public AffectationAdminResource(
        AffectationAdminService affectationAdminService,
        AffectationAdminRepository affectationAdminRepository
    ) {
        this.affectationAdminService = affectationAdminService;
        this.affectationAdminRepository = affectationAdminRepository;
    }

    /**
     * {@code POST  /affectation-admins} : Create a new affectationAdmin.
     *
     * @param affectationAdmin the affectationAdmin to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new affectationAdmin, or with status {@code 400 (Bad Request)} if the affectationAdmin has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/affectation-admins")
    public ResponseEntity<AffectationAdmin> createAffectationAdmin(@RequestBody AffectationAdmin affectationAdmin)
        throws URISyntaxException {
        log.debug("REST request to save AffectationAdmin : {}", affectationAdmin);
        if (affectationAdmin.getId() != null) {
            throw new BadRequestAlertException("A new affectationAdmin cannot already have an ID", ENTITY_NAME, "idexists");
        }
        AffectationAdmin result = affectationAdminService.save(affectationAdmin);
        return ResponseEntity
            .created(new URI("/api/affectation-admins/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /affectation-admins/:id} : Updates an existing affectationAdmin.
     *
     * @param id the id of the affectationAdmin to save.
     * @param affectationAdmin the affectationAdmin to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated affectationAdmin,
     * or with status {@code 400 (Bad Request)} if the affectationAdmin is not valid,
     * or with status {@code 500 (Internal Server Error)} if the affectationAdmin couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/affectation-admins/{id}")
    public ResponseEntity<AffectationAdmin> updateAffectationAdmin(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AffectationAdmin affectationAdmin
    ) throws URISyntaxException {
        log.debug("REST request to update AffectationAdmin : {}, {}", id, affectationAdmin);
        if (affectationAdmin.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, affectationAdmin.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!affectationAdminRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        AffectationAdmin result = affectationAdminService.update(affectationAdmin);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, affectationAdmin.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /affectation-admins/:id} : Partial updates given fields of an existing affectationAdmin, field will ignore if it is null
     *
     * @param id the id of the affectationAdmin to save.
     * @param affectationAdmin the affectationAdmin to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated affectationAdmin,
     * or with status {@code 400 (Bad Request)} if the affectationAdmin is not valid,
     * or with status {@code 404 (Not Found)} if the affectationAdmin is not found,
     * or with status {@code 500 (Internal Server Error)} if the affectationAdmin couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/affectation-admins/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<AffectationAdmin> partialUpdateAffectationAdmin(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody AffectationAdmin affectationAdmin
    ) throws URISyntaxException {
        log.debug("REST request to partial update AffectationAdmin partially : {}, {}", id, affectationAdmin);
        if (affectationAdmin.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, affectationAdmin.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!affectationAdminRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<AffectationAdmin> result = affectationAdminService.partialUpdate(affectationAdmin);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, affectationAdmin.getId().toString())
        );
    }

    /**
     * {@code GET  /affectation-admins} : get all the affectationAdmins.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of affectationAdmins in body.
     */
    @GetMapping("/affectation-admins")
    public List<AffectationAdmin> getAllAffectationAdmins() {
        log.debug("REST request to get all AffectationAdmins");
        return affectationAdminService.findAll();
    }

    /**
     * {@code GET  /affectation-admins/:id} : get the "id" affectationAdmin.
     *
     * @param id the id of the affectationAdmin to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the affectationAdmin, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/affectation-admins/{id}")
    public ResponseEntity<AffectationAdmin> getAffectationAdmin(@PathVariable Long id) {
        log.debug("REST request to get AffectationAdmin : {}", id);
        Optional<AffectationAdmin> affectationAdmin = affectationAdminService.findOne(id);
        return ResponseUtil.wrapOrNotFound(affectationAdmin);
    }

    /**
     * {@code DELETE  /affectation-admins/:id} : delete the "id" affectationAdmin.
     *
     * @param id the id of the affectationAdmin to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/affectation-admins/{id}")
    public ResponseEntity<Void> deleteAffectationAdmin(@PathVariable Long id) {
        log.debug("REST request to delete AffectationAdmin : {}", id);
        affectationAdminService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
