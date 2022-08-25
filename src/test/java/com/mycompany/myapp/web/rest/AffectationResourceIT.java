package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Affectation;
import com.mycompany.myapp.repository.AffectationRepository;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Random;
import java.util.concurrent.atomic.AtomicLong;
import javax.persistence.EntityManager;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.transaction.annotation.Transactional;

/**
 * Integration tests for the {@link AffectationResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AffectationResourceIT {

    private static final String DEFAULT_NOMPROJET = "AAAAAAAAAA";
    private static final String UPDATED_NOMPROJET = "BBBBBBBBBB";

    private static final String DEFAULT_DESCRIPTION = "AAAAAAAAAA";
    private static final String UPDATED_DESCRIPTION = "BBBBBBBBBB";

    private static final Instant DEFAULT_DATEDEBUT = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATEDEBUT = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_DATEFIN = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATEFIN = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/affectations";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AffectationRepository affectationRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAffectationMockMvc;

    private Affectation affectation;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Affectation createEntity(EntityManager em) {
        Affectation affectation = new Affectation()
            .nomprojet(DEFAULT_NOMPROJET)
            .description(DEFAULT_DESCRIPTION)
            .datedebut(DEFAULT_DATEDEBUT)
            .datefin(DEFAULT_DATEFIN);
        return affectation;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Affectation createUpdatedEntity(EntityManager em) {
        Affectation affectation = new Affectation()
            .nomprojet(UPDATED_NOMPROJET)
            .description(UPDATED_DESCRIPTION)
            .datedebut(UPDATED_DATEDEBUT)
            .datefin(UPDATED_DATEFIN);
        return affectation;
    }

    @BeforeEach
    public void initTest() {
        affectation = createEntity(em);
    }

    @Test
    @Transactional
    void createAffectation() throws Exception {
        int databaseSizeBeforeCreate = affectationRepository.findAll().size();
        // Create the Affectation
        restAffectationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(affectation)))
            .andExpect(status().isCreated());

        // Validate the Affectation in the database
        List<Affectation> affectationList = affectationRepository.findAll();
        assertThat(affectationList).hasSize(databaseSizeBeforeCreate + 1);
        Affectation testAffectation = affectationList.get(affectationList.size() - 1);
        assertThat(testAffectation.getNomprojet()).isEqualTo(DEFAULT_NOMPROJET);
        assertThat(testAffectation.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testAffectation.getDatedebut()).isEqualTo(DEFAULT_DATEDEBUT);
        assertThat(testAffectation.getDatefin()).isEqualTo(DEFAULT_DATEFIN);
    }

    @Test
    @Transactional
    void createAffectationWithExistingId() throws Exception {
        // Create the Affectation with an existing ID
        affectation.setId(1L);

        int databaseSizeBeforeCreate = affectationRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAffectationMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(affectation)))
            .andExpect(status().isBadRequest());

        // Validate the Affectation in the database
        List<Affectation> affectationList = affectationRepository.findAll();
        assertThat(affectationList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAffectations() throws Exception {
        // Initialize the database
        affectationRepository.saveAndFlush(affectation);

        // Get all the affectationList
        restAffectationMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(affectation.getId().intValue())))
            .andExpect(jsonPath("$.[*].nomprojet").value(hasItem(DEFAULT_NOMPROJET)))
            .andExpect(jsonPath("$.[*].description").value(hasItem(DEFAULT_DESCRIPTION)))
            .andExpect(jsonPath("$.[*].datedebut").value(hasItem(DEFAULT_DATEDEBUT.toString())))
            .andExpect(jsonPath("$.[*].datefin").value(hasItem(DEFAULT_DATEFIN.toString())));
    }

    @Test
    @Transactional
    void getAffectation() throws Exception {
        // Initialize the database
        affectationRepository.saveAndFlush(affectation);

        // Get the affectation
        restAffectationMockMvc
            .perform(get(ENTITY_API_URL_ID, affectation.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(affectation.getId().intValue()))
            .andExpect(jsonPath("$.nomprojet").value(DEFAULT_NOMPROJET))
            .andExpect(jsonPath("$.description").value(DEFAULT_DESCRIPTION))
            .andExpect(jsonPath("$.datedebut").value(DEFAULT_DATEDEBUT.toString()))
            .andExpect(jsonPath("$.datefin").value(DEFAULT_DATEFIN.toString()));
    }

    @Test
    @Transactional
    void getNonExistingAffectation() throws Exception {
        // Get the affectation
        restAffectationMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAffectation() throws Exception {
        // Initialize the database
        affectationRepository.saveAndFlush(affectation);

        int databaseSizeBeforeUpdate = affectationRepository.findAll().size();

        // Update the affectation
        Affectation updatedAffectation = affectationRepository.findById(affectation.getId()).get();
        // Disconnect from session so that the updates on updatedAffectation are not directly saved in db
        em.detach(updatedAffectation);
        updatedAffectation
            .nomprojet(UPDATED_NOMPROJET)
            .description(UPDATED_DESCRIPTION)
            .datedebut(UPDATED_DATEDEBUT)
            .datefin(UPDATED_DATEFIN);

        restAffectationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAffectation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAffectation))
            )
            .andExpect(status().isOk());

        // Validate the Affectation in the database
        List<Affectation> affectationList = affectationRepository.findAll();
        assertThat(affectationList).hasSize(databaseSizeBeforeUpdate);
        Affectation testAffectation = affectationList.get(affectationList.size() - 1);
        assertThat(testAffectation.getNomprojet()).isEqualTo(UPDATED_NOMPROJET);
        assertThat(testAffectation.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testAffectation.getDatedebut()).isEqualTo(UPDATED_DATEDEBUT);
        assertThat(testAffectation.getDatefin()).isEqualTo(UPDATED_DATEFIN);
    }

    @Test
    @Transactional
    void putNonExistingAffectation() throws Exception {
        int databaseSizeBeforeUpdate = affectationRepository.findAll().size();
        affectation.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAffectationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, affectation.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(affectation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Affectation in the database
        List<Affectation> affectationList = affectationRepository.findAll();
        assertThat(affectationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAffectation() throws Exception {
        int databaseSizeBeforeUpdate = affectationRepository.findAll().size();
        affectation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAffectationMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(affectation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Affectation in the database
        List<Affectation> affectationList = affectationRepository.findAll();
        assertThat(affectationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAffectation() throws Exception {
        int databaseSizeBeforeUpdate = affectationRepository.findAll().size();
        affectation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAffectationMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(affectation)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Affectation in the database
        List<Affectation> affectationList = affectationRepository.findAll();
        assertThat(affectationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAffectationWithPatch() throws Exception {
        // Initialize the database
        affectationRepository.saveAndFlush(affectation);

        int databaseSizeBeforeUpdate = affectationRepository.findAll().size();

        // Update the affectation using partial update
        Affectation partialUpdatedAffectation = new Affectation();
        partialUpdatedAffectation.setId(affectation.getId());

        partialUpdatedAffectation.nomprojet(UPDATED_NOMPROJET).datefin(UPDATED_DATEFIN);

        restAffectationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAffectation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAffectation))
            )
            .andExpect(status().isOk());

        // Validate the Affectation in the database
        List<Affectation> affectationList = affectationRepository.findAll();
        assertThat(affectationList).hasSize(databaseSizeBeforeUpdate);
        Affectation testAffectation = affectationList.get(affectationList.size() - 1);
        assertThat(testAffectation.getNomprojet()).isEqualTo(UPDATED_NOMPROJET);
        assertThat(testAffectation.getDescription()).isEqualTo(DEFAULT_DESCRIPTION);
        assertThat(testAffectation.getDatedebut()).isEqualTo(DEFAULT_DATEDEBUT);
        assertThat(testAffectation.getDatefin()).isEqualTo(UPDATED_DATEFIN);
    }

    @Test
    @Transactional
    void fullUpdateAffectationWithPatch() throws Exception {
        // Initialize the database
        affectationRepository.saveAndFlush(affectation);

        int databaseSizeBeforeUpdate = affectationRepository.findAll().size();

        // Update the affectation using partial update
        Affectation partialUpdatedAffectation = new Affectation();
        partialUpdatedAffectation.setId(affectation.getId());

        partialUpdatedAffectation
            .nomprojet(UPDATED_NOMPROJET)
            .description(UPDATED_DESCRIPTION)
            .datedebut(UPDATED_DATEDEBUT)
            .datefin(UPDATED_DATEFIN);

        restAffectationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAffectation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAffectation))
            )
            .andExpect(status().isOk());

        // Validate the Affectation in the database
        List<Affectation> affectationList = affectationRepository.findAll();
        assertThat(affectationList).hasSize(databaseSizeBeforeUpdate);
        Affectation testAffectation = affectationList.get(affectationList.size() - 1);
        assertThat(testAffectation.getNomprojet()).isEqualTo(UPDATED_NOMPROJET);
        assertThat(testAffectation.getDescription()).isEqualTo(UPDATED_DESCRIPTION);
        assertThat(testAffectation.getDatedebut()).isEqualTo(UPDATED_DATEDEBUT);
        assertThat(testAffectation.getDatefin()).isEqualTo(UPDATED_DATEFIN);
    }

    @Test
    @Transactional
    void patchNonExistingAffectation() throws Exception {
        int databaseSizeBeforeUpdate = affectationRepository.findAll().size();
        affectation.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAffectationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, affectation.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(affectation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Affectation in the database
        List<Affectation> affectationList = affectationRepository.findAll();
        assertThat(affectationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAffectation() throws Exception {
        int databaseSizeBeforeUpdate = affectationRepository.findAll().size();
        affectation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAffectationMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(affectation))
            )
            .andExpect(status().isBadRequest());

        // Validate the Affectation in the database
        List<Affectation> affectationList = affectationRepository.findAll();
        assertThat(affectationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAffectation() throws Exception {
        int databaseSizeBeforeUpdate = affectationRepository.findAll().size();
        affectation.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAffectationMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(affectation))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Affectation in the database
        List<Affectation> affectationList = affectationRepository.findAll();
        assertThat(affectationList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAffectation() throws Exception {
        // Initialize the database
        affectationRepository.saveAndFlush(affectation);

        int databaseSizeBeforeDelete = affectationRepository.findAll().size();

        // Delete the affectation
        restAffectationMockMvc
            .perform(delete(ENTITY_API_URL_ID, affectation.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Affectation> affectationList = affectationRepository.findAll();
        assertThat(affectationList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
