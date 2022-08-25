package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Entretien;
import com.mycompany.myapp.repository.EntretienRepository;
import com.mycompany.myapp.service.EntretienService;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Entretien}.
 */
@RestController
@RequestMapping("/api")
public class EntretienResource {

    private final Logger log = LoggerFactory.getLogger(EntretienResource.class);

    private static final String ENTITY_NAME = "entretien";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final EntretienService entretienService;

    private final EntretienRepository entretienRepository;

    public EntretienResource(EntretienService entretienService, EntretienRepository entretienRepository) {
        this.entretienService = entretienService;
        this.entretienRepository = entretienRepository;
    }

    /**
     * {@code POST  /entretiens} : Create a new entretien.
     *
     * @param entretien the entretien to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new entretien, or with status {@code 400 (Bad Request)} if the entretien has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/entretiens")
    public ResponseEntity<Entretien> createEntretien(@RequestBody Entretien entretien) throws URISyntaxException {
        log.debug("REST request to save Entretien : {}", entretien);
        if (entretien.getId() != null) {
            throw new BadRequestAlertException("A new entretien cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Entretien result = entretienService.save(entretien);
        return ResponseEntity
            .created(new URI("/api/entretiens/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /entretiens/:id} : Updates an existing entretien.
     *
     * @param id the id of the entretien to save.
     * @param entretien the entretien to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated entretien,
     * or with status {@code 400 (Bad Request)} if the entretien is not valid,
     * or with status {@code 500 (Internal Server Error)} if the entretien couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/entretiens/{id}")
    public ResponseEntity<Entretien> updateEntretien(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Entretien entretien
    ) throws URISyntaxException {
        log.debug("REST request to update Entretien : {}, {}", id, entretien);
        if (entretien.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, entretien.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!entretienRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Entretien result = entretienService.update(entretien);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, entretien.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /entretiens/:id} : Partial updates given fields of an existing entretien, field will ignore if it is null
     *
     * @param id the id of the entretien to save.
     * @param entretien the entretien to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated entretien,
     * or with status {@code 400 (Bad Request)} if the entretien is not valid,
     * or with status {@code 404 (Not Found)} if the entretien is not found,
     * or with status {@code 500 (Internal Server Error)} if the entretien couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/entretiens/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Entretien> partialUpdateEntretien(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Entretien entretien
    ) throws URISyntaxException {
        log.debug("REST request to partial update Entretien partially : {}, {}", id, entretien);
        if (entretien.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, entretien.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!entretienRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Entretien> result = entretienService.partialUpdate(entretien);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, entretien.getId().toString())
        );
    }

    /**
     * {@code GET  /entretiens} : get all the entretiens.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of entretiens in body.
     */
    @GetMapping("/entretiens")
    public List<Entretien> getAllEntretiens() {
        log.debug("REST request to get all Entretiens");
        return entretienService.findAll();
    }

    /**
     * {@code GET  /entretiens/:id} : get the "id" entretien.
     *
     * @param id the id of the entretien to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the entretien, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/entretiens/{id}")
    public ResponseEntity<Entretien> getEntretien(@PathVariable Long id) {
        log.debug("REST request to get Entretien : {}", id);
        Optional<Entretien> entretien = entretienService.findOne(id);
        return ResponseUtil.wrapOrNotFound(entretien);
    }

    /**
     * {@code DELETE  /entretiens/:id} : delete the "id" entretien.
     *
     * @param id the id of the entretien to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/entretiens/{id}")
    public ResponseEntity<Void> deleteEntretien(@PathVariable Long id) {
        log.debug("REST request to delete Entretien : {}", id);
        entretienService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
