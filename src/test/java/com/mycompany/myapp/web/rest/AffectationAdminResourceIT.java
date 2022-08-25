package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.AffectationAdmin;
import com.mycompany.myapp.repository.AffectationAdminRepository;
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
 * Integration tests for the {@link AffectationAdminResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class AffectationAdminResourceIT {

    private static final Instant DEFAULT_DATEDEBUT = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATEDEBUT = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final Instant DEFAULT_DATEFIN = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATEFIN = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String ENTITY_API_URL = "/api/affectation-admins";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private AffectationAdminRepository affectationAdminRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restAffectationAdminMockMvc;

    private AffectationAdmin affectationAdmin;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AffectationAdmin createEntity(EntityManager em) {
        AffectationAdmin affectationAdmin = new AffectationAdmin().datedebut(DEFAULT_DATEDEBUT).datefin(DEFAULT_DATEFIN);
        return affectationAdmin;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static AffectationAdmin createUpdatedEntity(EntityManager em) {
        AffectationAdmin affectationAdmin = new AffectationAdmin().datedebut(UPDATED_DATEDEBUT).datefin(UPDATED_DATEFIN);
        return affectationAdmin;
    }

    @BeforeEach
    public void initTest() {
        affectationAdmin = createEntity(em);
    }

    @Test
    @Transactional
    void createAffectationAdmin() throws Exception {
        int databaseSizeBeforeCreate = affectationAdminRepository.findAll().size();
        // Create the AffectationAdmin
        restAffectationAdminMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(affectationAdmin))
            )
            .andExpect(status().isCreated());

        // Validate the AffectationAdmin in the database
        List<AffectationAdmin> affectationAdminList = affectationAdminRepository.findAll();
        assertThat(affectationAdminList).hasSize(databaseSizeBeforeCreate + 1);
        AffectationAdmin testAffectationAdmin = affectationAdminList.get(affectationAdminList.size() - 1);
        assertThat(testAffectationAdmin.getDatedebut()).isEqualTo(DEFAULT_DATEDEBUT);
        assertThat(testAffectationAdmin.getDatefin()).isEqualTo(DEFAULT_DATEFIN);
    }

    @Test
    @Transactional
    void createAffectationAdminWithExistingId() throws Exception {
        // Create the AffectationAdmin with an existing ID
        affectationAdmin.setId(1L);

        int databaseSizeBeforeCreate = affectationAdminRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restAffectationAdminMockMvc
            .perform(
                post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(affectationAdmin))
            )
            .andExpect(status().isBadRequest());

        // Validate the AffectationAdmin in the database
        List<AffectationAdmin> affectationAdminList = affectationAdminRepository.findAll();
        assertThat(affectationAdminList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllAffectationAdmins() throws Exception {
        // Initialize the database
        affectationAdminRepository.saveAndFlush(affectationAdmin);

        // Get all the affectationAdminList
        restAffectationAdminMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(affectationAdmin.getId().intValue())))
            .andExpect(jsonPath("$.[*].datedebut").value(hasItem(DEFAULT_DATEDEBUT.toString())))
            .andExpect(jsonPath("$.[*].datefin").value(hasItem(DEFAULT_DATEFIN.toString())));
    }

    @Test
    @Transactional
    void getAffectationAdmin() throws Exception {
        // Initialize the database
        affectationAdminRepository.saveAndFlush(affectationAdmin);

        // Get the affectationAdmin
        restAffectationAdminMockMvc
            .perform(get(ENTITY_API_URL_ID, affectationAdmin.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(affectationAdmin.getId().intValue()))
            .andExpect(jsonPath("$.datedebut").value(DEFAULT_DATEDEBUT.toString()))
            .andExpect(jsonPath("$.datefin").value(DEFAULT_DATEFIN.toString()));
    }

    @Test
    @Transactional
    void getNonExistingAffectationAdmin() throws Exception {
        // Get the affectationAdmin
        restAffectationAdminMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewAffectationAdmin() throws Exception {
        // Initialize the database
        affectationAdminRepository.saveAndFlush(affectationAdmin);

        int databaseSizeBeforeUpdate = affectationAdminRepository.findAll().size();

        // Update the affectationAdmin
        AffectationAdmin updatedAffectationAdmin = affectationAdminRepository.findById(affectationAdmin.getId()).get();
        // Disconnect from session so that the updates on updatedAffectationAdmin are not directly saved in db
        em.detach(updatedAffectationAdmin);
        updatedAffectationAdmin.datedebut(UPDATED_DATEDEBUT).datefin(UPDATED_DATEFIN);

        restAffectationAdminMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedAffectationAdmin.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedAffectationAdmin))
            )
            .andExpect(status().isOk());

        // Validate the AffectationAdmin in the database
        List<AffectationAdmin> affectationAdminList = affectationAdminRepository.findAll();
        assertThat(affectationAdminList).hasSize(databaseSizeBeforeUpdate);
        AffectationAdmin testAffectationAdmin = affectationAdminList.get(affectationAdminList.size() - 1);
        assertThat(testAffectationAdmin.getDatedebut()).isEqualTo(UPDATED_DATEDEBUT);
        assertThat(testAffectationAdmin.getDatefin()).isEqualTo(UPDATED_DATEFIN);
    }

    @Test
    @Transactional
    void putNonExistingAffectationAdmin() throws Exception {
        int databaseSizeBeforeUpdate = affectationAdminRepository.findAll().size();
        affectationAdmin.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAffectationAdminMockMvc
            .perform(
                put(ENTITY_API_URL_ID, affectationAdmin.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(affectationAdmin))
            )
            .andExpect(status().isBadRequest());

        // Validate the AffectationAdmin in the database
        List<AffectationAdmin> affectationAdminList = affectationAdminRepository.findAll();
        assertThat(affectationAdminList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchAffectationAdmin() throws Exception {
        int databaseSizeBeforeUpdate = affectationAdminRepository.findAll().size();
        affectationAdmin.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAffectationAdminMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(affectationAdmin))
            )
            .andExpect(status().isBadRequest());

        // Validate the AffectationAdmin in the database
        List<AffectationAdmin> affectationAdminList = affectationAdminRepository.findAll();
        assertThat(affectationAdminList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamAffectationAdmin() throws Exception {
        int databaseSizeBeforeUpdate = affectationAdminRepository.findAll().size();
        affectationAdmin.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAffectationAdminMockMvc
            .perform(
                put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(affectationAdmin))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AffectationAdmin in the database
        List<AffectationAdmin> affectationAdminList = affectationAdminRepository.findAll();
        assertThat(affectationAdminList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateAffectationAdminWithPatch() throws Exception {
        // Initialize the database
        affectationAdminRepository.saveAndFlush(affectationAdmin);

        int databaseSizeBeforeUpdate = affectationAdminRepository.findAll().size();

        // Update the affectationAdmin using partial update
        AffectationAdmin partialUpdatedAffectationAdmin = new AffectationAdmin();
        partialUpdatedAffectationAdmin.setId(affectationAdmin.getId());

        restAffectationAdminMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAffectationAdmin.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAffectationAdmin))
            )
            .andExpect(status().isOk());

        // Validate the AffectationAdmin in the database
        List<AffectationAdmin> affectationAdminList = affectationAdminRepository.findAll();
        assertThat(affectationAdminList).hasSize(databaseSizeBeforeUpdate);
        AffectationAdmin testAffectationAdmin = affectationAdminList.get(affectationAdminList.size() - 1);
        assertThat(testAffectationAdmin.getDatedebut()).isEqualTo(DEFAULT_DATEDEBUT);
        assertThat(testAffectationAdmin.getDatefin()).isEqualTo(DEFAULT_DATEFIN);
    }

    @Test
    @Transactional
    void fullUpdateAffectationAdminWithPatch() throws Exception {
        // Initialize the database
        affectationAdminRepository.saveAndFlush(affectationAdmin);

        int databaseSizeBeforeUpdate = affectationAdminRepository.findAll().size();

        // Update the affectationAdmin using partial update
        AffectationAdmin partialUpdatedAffectationAdmin = new AffectationAdmin();
        partialUpdatedAffectationAdmin.setId(affectationAdmin.getId());

        partialUpdatedAffectationAdmin.datedebut(UPDATED_DATEDEBUT).datefin(UPDATED_DATEFIN);

        restAffectationAdminMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedAffectationAdmin.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedAffectationAdmin))
            )
            .andExpect(status().isOk());

        // Validate the AffectationAdmin in the database
        List<AffectationAdmin> affectationAdminList = affectationAdminRepository.findAll();
        assertThat(affectationAdminList).hasSize(databaseSizeBeforeUpdate);
        AffectationAdmin testAffectationAdmin = affectationAdminList.get(affectationAdminList.size() - 1);
        assertThat(testAffectationAdmin.getDatedebut()).isEqualTo(UPDATED_DATEDEBUT);
        assertThat(testAffectationAdmin.getDatefin()).isEqualTo(UPDATED_DATEFIN);
    }

    @Test
    @Transactional
    void patchNonExistingAffectationAdmin() throws Exception {
        int databaseSizeBeforeUpdate = affectationAdminRepository.findAll().size();
        affectationAdmin.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restAffectationAdminMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, affectationAdmin.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(affectationAdmin))
            )
            .andExpect(status().isBadRequest());

        // Validate the AffectationAdmin in the database
        List<AffectationAdmin> affectationAdminList = affectationAdminRepository.findAll();
        assertThat(affectationAdminList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchAffectationAdmin() throws Exception {
        int databaseSizeBeforeUpdate = affectationAdminRepository.findAll().size();
        affectationAdmin.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAffectationAdminMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(affectationAdmin))
            )
            .andExpect(status().isBadRequest());

        // Validate the AffectationAdmin in the database
        List<AffectationAdmin> affectationAdminList = affectationAdminRepository.findAll();
        assertThat(affectationAdminList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamAffectationAdmin() throws Exception {
        int databaseSizeBeforeUpdate = affectationAdminRepository.findAll().size();
        affectationAdmin.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restAffectationAdminMockMvc
            .perform(
                patch(ENTITY_API_URL)
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(affectationAdmin))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the AffectationAdmin in the database
        List<AffectationAdmin> affectationAdminList = affectationAdminRepository.findAll();
        assertThat(affectationAdminList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteAffectationAdmin() throws Exception {
        // Initialize the database
        affectationAdminRepository.saveAndFlush(affectationAdmin);

        int databaseSizeBeforeDelete = affectationAdminRepository.findAll().size();

        // Delete the affectationAdmin
        restAffectationAdminMockMvc
            .perform(delete(ENTITY_API_URL_ID, affectationAdmin.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<AffectationAdmin> affectationAdminList = affectationAdminRepository.findAll();
        assertThat(affectationAdminList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
