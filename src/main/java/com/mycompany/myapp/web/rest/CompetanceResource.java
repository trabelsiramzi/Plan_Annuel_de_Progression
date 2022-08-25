package com.mycompany.myapp.web.rest;

import com.mycompany.myapp.domain.Competance;
import com.mycompany.myapp.repository.CompetanceRepository;
import com.mycompany.myapp.service.CompetanceService;
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
 * REST controller for managing {@link com.mycompany.myapp.domain.Competance}.
 */
@RestController
@RequestMapping("/api")
public class CompetanceResource {

    private final Logger log = LoggerFactory.getLogger(CompetanceResource.class);

    private static final String ENTITY_NAME = "competance";

    @Value("${jhipster.clientApp.name}")
    private String applicationName;

    private final CompetanceService competanceService;

    private final CompetanceRepository competanceRepository;

    public CompetanceResource(CompetanceService competanceService, CompetanceRepository competanceRepository) {
        this.competanceService = competanceService;
        this.competanceRepository = competanceRepository;
    }

    /**
     * {@code POST  /competances} : Create a new competance.
     *
     * @param competance the competance to create.
     * @return the {@link ResponseEntity} with status {@code 201 (Created)} and with body the new competance, or with status {@code 400 (Bad Request)} if the competance has already an ID.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PostMapping("/competances")
    public ResponseEntity<Competance> createCompetance(@RequestBody Competance competance) throws URISyntaxException {
        log.debug("REST request to save Competance : {}", competance);
        if (competance.getId() != null) {
            throw new BadRequestAlertException("A new competance cannot already have an ID", ENTITY_NAME, "idexists");
        }
        Competance result = competanceService.save(competance);
        return ResponseEntity
            .created(new URI("/api/competances/" + result.getId()))
            .headers(HeaderUtil.createEntityCreationAlert(applicationName, true, ENTITY_NAME, result.getId().toString()))
            .body(result);
    }

    /**
     * {@code PUT  /competances/:id} : Updates an existing competance.
     *
     * @param id the id of the competance to save.
     * @param competance the competance to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated competance,
     * or with status {@code 400 (Bad Request)} if the competance is not valid,
     * or with status {@code 500 (Internal Server Error)} if the competance couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PutMapping("/competances/{id}")
    public ResponseEntity<Competance> updateCompetance(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Competance competance
    ) throws URISyntaxException {
        log.debug("REST request to update Competance : {}, {}", id, competance);
        if (competance.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, competance.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!competanceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Competance result = competanceService.update(competance);
        return ResponseEntity
            .ok()
            .headers(HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, competance.getId().toString()))
            .body(result);
    }

    /**
     * {@code PATCH  /competances/:id} : Partial updates given fields of an existing competance, field will ignore if it is null
     *
     * @param id the id of the competance to save.
     * @param competance the competance to update.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the updated competance,
     * or with status {@code 400 (Bad Request)} if the competance is not valid,
     * or with status {@code 404 (Not Found)} if the competance is not found,
     * or with status {@code 500 (Internal Server Error)} if the competance couldn't be updated.
     * @throws URISyntaxException if the Location URI syntax is incorrect.
     */
    @PatchMapping(value = "/competances/{id}", consumes = { "application/json", "application/merge-patch+json" })
    public ResponseEntity<Competance> partialUpdateCompetance(
        @PathVariable(value = "id", required = false) final Long id,
        @RequestBody Competance competance
    ) throws URISyntaxException {
        log.debug("REST request to partial update Competance partially : {}, {}", id, competance);
        if (competance.getId() == null) {
            throw new BadRequestAlertException("Invalid id", ENTITY_NAME, "idnull");
        }
        if (!Objects.equals(id, competance.getId())) {
            throw new BadRequestAlertException("Invalid ID", ENTITY_NAME, "idinvalid");
        }

        if (!competanceRepository.existsById(id)) {
            throw new BadRequestAlertException("Entity not found", ENTITY_NAME, "idnotfound");
        }

        Optional<Competance> result = competanceService.partialUpdate(competance);

        return ResponseUtil.wrapOrNotFound(
            result,
            HeaderUtil.createEntityUpdateAlert(applicationName, true, ENTITY_NAME, competance.getId().toString())
        );
    }

    /**
     * {@code GET  /competances} : get all the competances.
     *
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and the list of competances in body.
     */
    @GetMapping("/competances")
    public List<Competance> getAllCompetances() {
        log.debug("REST request to get all Competances");
        return competanceService.findAll();
    }

    /**
     * {@code GET  /competances/:id} : get the "id" competance.
     *
     * @param id the id of the competance to retrieve.
     * @return the {@link ResponseEntity} with status {@code 200 (OK)} and with body the competance, or with status {@code 404 (Not Found)}.
     */
    @GetMapping("/competances/{id}")
    public ResponseEntity<Competance> getCompetance(@PathVariable Long id) {
        log.debug("REST request to get Competance : {}", id);
        Optional<Competance> competance = competanceService.findOne(id);
        return ResponseUtil.wrapOrNotFound(competance);
    }

    /**
     * {@code DELETE  /competances/:id} : delete the "id" competance.
     *
     * @param id the id of the competance to delete.
     * @return the {@link ResponseEntity} with status {@code 204 (NO_CONTENT)}.
     */
    @DeleteMapping("/competances/{id}")
    public ResponseEntity<Void> deleteCompetance(@PathVariable Long id) {
        log.debug("REST request to delete Competance : {}", id);
        competanceService.delete(id);
        return ResponseEntity
            .noContent()
            .headers(HeaderUtil.createEntityDeletionAlert(applicationName, true, ENTITY_NAME, id.toString()))
            .build();
    }
}
