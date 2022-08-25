package com.mycompany.myapp.web.rest;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasItem;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.mycompany.myapp.IntegrationTest;
import com.mycompany.myapp.domain.Entretien;
import com.mycompany.myapp.repository.EntretienRepository;
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
 * Integration tests for the {@link EntretienResource} REST controller.
 */
@IntegrationTest
@AutoConfigureMockMvc
@WithMockUser
class EntretienResourceIT {

    private static final Instant DEFAULT_DATEENTRETIENT = Instant.ofEpochMilli(0L);
    private static final Instant UPDATED_DATEENTRETIENT = Instant.now().truncatedTo(ChronoUnit.MILLIS);

    private static final String DEFAULT_RESULTAT = "AAAAAAAAAA";
    private static final String UPDATED_RESULTAT = "BBBBBBBBBB";

    private static final String DEFAULT_CONFIRMATIONRESPONSABLE = "AAAAAAAAAA";
    private static final String UPDATED_CONFIRMATIONRESPONSABLE = "BBBBBBBBBB";

    private static final String DEFAULT_CONFIRMATIONSALARIE = "AAAAAAAAAA";
    private static final String UPDATED_CONFIRMATIONSALARIE = "BBBBBBBBBB";

    private static final String ENTITY_API_URL = "/api/entretiens";
    private static final String ENTITY_API_URL_ID = ENTITY_API_URL + "/{id}";

    private static Random random = new Random();
    private static AtomicLong count = new AtomicLong(random.nextInt() + (2 * Integer.MAX_VALUE));

    @Autowired
    private EntretienRepository entretienRepository;

    @Autowired
    private EntityManager em;

    @Autowired
    private MockMvc restEntretienMockMvc;

    private Entretien entretien;

    /**
     * Create an entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Entretien createEntity(EntityManager em) {
        Entretien entretien = new Entretien()
            .dateentretient(DEFAULT_DATEENTRETIENT)
            .resultat(DEFAULT_RESULTAT)
            .confirmationresponsable(DEFAULT_CONFIRMATIONRESPONSABLE)
            .confirmationsalarie(DEFAULT_CONFIRMATIONSALARIE);
        return entretien;
    }

    /**
     * Create an updated entity for this test.
     *
     * This is a static method, as tests for other entities might also need it,
     * if they test an entity which requires the current entity.
     */
    public static Entretien createUpdatedEntity(EntityManager em) {
        Entretien entretien = new Entretien()
            .dateentretient(UPDATED_DATEENTRETIENT)
            .resultat(UPDATED_RESULTAT)
            .confirmationresponsable(UPDATED_CONFIRMATIONRESPONSABLE)
            .confirmationsalarie(UPDATED_CONFIRMATIONSALARIE);
        return entretien;
    }

    @BeforeEach
    public void initTest() {
        entretien = createEntity(em);
    }

    @Test
    @Transactional
    void createEntretien() throws Exception {
        int databaseSizeBeforeCreate = entretienRepository.findAll().size();
        // Create the Entretien
        restEntretienMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(entretien)))
            .andExpect(status().isCreated());

        // Validate the Entretien in the database
        List<Entretien> entretienList = entretienRepository.findAll();
        assertThat(entretienList).hasSize(databaseSizeBeforeCreate + 1);
        Entretien testEntretien = entretienList.get(entretienList.size() - 1);
        assertThat(testEntretien.getDateentretient()).isEqualTo(DEFAULT_DATEENTRETIENT);
        assertThat(testEntretien.getResultat()).isEqualTo(DEFAULT_RESULTAT);
        assertThat(testEntretien.getConfirmationresponsable()).isEqualTo(DEFAULT_CONFIRMATIONRESPONSABLE);
        assertThat(testEntretien.getConfirmationsalarie()).isEqualTo(DEFAULT_CONFIRMATIONSALARIE);
    }

    @Test
    @Transactional
    void createEntretienWithExistingId() throws Exception {
        // Create the Entretien with an existing ID
        entretien.setId(1L);

        int databaseSizeBeforeCreate = entretienRepository.findAll().size();

        // An entity with an existing ID cannot be created, so this API call must fail
        restEntretienMockMvc
            .perform(post(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(entretien)))
            .andExpect(status().isBadRequest());

        // Validate the Entretien in the database
        List<Entretien> entretienList = entretienRepository.findAll();
        assertThat(entretienList).hasSize(databaseSizeBeforeCreate);
    }

    @Test
    @Transactional
    void getAllEntretiens() throws Exception {
        // Initialize the database
        entretienRepository.saveAndFlush(entretien);

        // Get all the entretienList
        restEntretienMockMvc
            .perform(get(ENTITY_API_URL + "?sort=id,desc"))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.[*].id").value(hasItem(entretien.getId().intValue())))
            .andExpect(jsonPath("$.[*].dateentretient").value(hasItem(DEFAULT_DATEENTRETIENT.toString())))
            .andExpect(jsonPath("$.[*].resultat").value(hasItem(DEFAULT_RESULTAT)))
            .andExpect(jsonPath("$.[*].confirmationresponsable").value(hasItem(DEFAULT_CONFIRMATIONRESPONSABLE)))
            .andExpect(jsonPath("$.[*].confirmationsalarie").value(hasItem(DEFAULT_CONFIRMATIONSALARIE)));
    }

    @Test
    @Transactional
    void getEntretien() throws Exception {
        // Initialize the database
        entretienRepository.saveAndFlush(entretien);

        // Get the entretien
        restEntretienMockMvc
            .perform(get(ENTITY_API_URL_ID, entretien.getId()))
            .andExpect(status().isOk())
            .andExpect(content().contentType(MediaType.APPLICATION_JSON_VALUE))
            .andExpect(jsonPath("$.id").value(entretien.getId().intValue()))
            .andExpect(jsonPath("$.dateentretient").value(DEFAULT_DATEENTRETIENT.toString()))
            .andExpect(jsonPath("$.resultat").value(DEFAULT_RESULTAT))
            .andExpect(jsonPath("$.confirmationresponsable").value(DEFAULT_CONFIRMATIONRESPONSABLE))
            .andExpect(jsonPath("$.confirmationsalarie").value(DEFAULT_CONFIRMATIONSALARIE));
    }

    @Test
    @Transactional
    void getNonExistingEntretien() throws Exception {
        // Get the entretien
        restEntretienMockMvc.perform(get(ENTITY_API_URL_ID, Long.MAX_VALUE)).andExpect(status().isNotFound());
    }

    @Test
    @Transactional
    void putNewEntretien() throws Exception {
        // Initialize the database
        entretienRepository.saveAndFlush(entretien);

        int databaseSizeBeforeUpdate = entretienRepository.findAll().size();

        // Update the entretien
        Entretien updatedEntretien = entretienRepository.findById(entretien.getId()).get();
        // Disconnect from session so that the updates on updatedEntretien are not directly saved in db
        em.detach(updatedEntretien);
        updatedEntretien
            .dateentretient(UPDATED_DATEENTRETIENT)
            .resultat(UPDATED_RESULTAT)
            .confirmationresponsable(UPDATED_CONFIRMATIONRESPONSABLE)
            .confirmationsalarie(UPDATED_CONFIRMATIONSALARIE);

        restEntretienMockMvc
            .perform(
                put(ENTITY_API_URL_ID, updatedEntretien.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(updatedEntretien))
            )
            .andExpect(status().isOk());

        // Validate the Entretien in the database
        List<Entretien> entretienList = entretienRepository.findAll();
        assertThat(entretienList).hasSize(databaseSizeBeforeUpdate);
        Entretien testEntretien = entretienList.get(entretienList.size() - 1);
        assertThat(testEntretien.getDateentretient()).isEqualTo(UPDATED_DATEENTRETIENT);
        assertThat(testEntretien.getResultat()).isEqualTo(UPDATED_RESULTAT);
        assertThat(testEntretien.getConfirmationresponsable()).isEqualTo(UPDATED_CONFIRMATIONRESPONSABLE);
        assertThat(testEntretien.getConfirmationsalarie()).isEqualTo(UPDATED_CONFIRMATIONSALARIE);
    }

    @Test
    @Transactional
    void putNonExistingEntretien() throws Exception {
        int databaseSizeBeforeUpdate = entretienRepository.findAll().size();
        entretien.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEntretienMockMvc
            .perform(
                put(ENTITY_API_URL_ID, entretien.getId())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(entretien))
            )
            .andExpect(status().isBadRequest());

        // Validate the Entretien in the database
        List<Entretien> entretienList = entretienRepository.findAll();
        assertThat(entretienList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithIdMismatchEntretien() throws Exception {
        int databaseSizeBeforeUpdate = entretienRepository.findAll().size();
        entretien.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEntretienMockMvc
            .perform(
                put(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType(MediaType.APPLICATION_JSON)
                    .content(TestUtil.convertObjectToJsonBytes(entretien))
            )
            .andExpect(status().isBadRequest());

        // Validate the Entretien in the database
        List<Entretien> entretienList = entretienRepository.findAll();
        assertThat(entretienList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void putWithMissingIdPathParamEntretien() throws Exception {
        int databaseSizeBeforeUpdate = entretienRepository.findAll().size();
        entretien.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEntretienMockMvc
            .perform(put(ENTITY_API_URL).contentType(MediaType.APPLICATION_JSON).content(TestUtil.convertObjectToJsonBytes(entretien)))
            .andExpect(status().isMethodNotAllowed());

        // Validate the Entretien in the database
        List<Entretien> entretienList = entretienRepository.findAll();
        assertThat(entretienList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void partialUpdateEntretienWithPatch() throws Exception {
        // Initialize the database
        entretienRepository.saveAndFlush(entretien);

        int databaseSizeBeforeUpdate = entretienRepository.findAll().size();

        // Update the entretien using partial update
        Entretien partialUpdatedEntretien = new Entretien();
        partialUpdatedEntretien.setId(entretien.getId());

        partialUpdatedEntretien
            .dateentretient(UPDATED_DATEENTRETIENT)
            .resultat(UPDATED_RESULTAT)
            .confirmationsalarie(UPDATED_CONFIRMATIONSALARIE);

        restEntretienMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEntretien.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEntretien))
            )
            .andExpect(status().isOk());

        // Validate the Entretien in the database
        List<Entretien> entretienList = entretienRepository.findAll();
        assertThat(entretienList).hasSize(databaseSizeBeforeUpdate);
        Entretien testEntretien = entretienList.get(entretienList.size() - 1);
        assertThat(testEntretien.getDateentretient()).isEqualTo(UPDATED_DATEENTRETIENT);
        assertThat(testEntretien.getResultat()).isEqualTo(UPDATED_RESULTAT);
        assertThat(testEntretien.getConfirmationresponsable()).isEqualTo(DEFAULT_CONFIRMATIONRESPONSABLE);
        assertThat(testEntretien.getConfirmationsalarie()).isEqualTo(UPDATED_CONFIRMATIONSALARIE);
    }

    @Test
    @Transactional
    void fullUpdateEntretienWithPatch() throws Exception {
        // Initialize the database
        entretienRepository.saveAndFlush(entretien);

        int databaseSizeBeforeUpdate = entretienRepository.findAll().size();

        // Update the entretien using partial update
        Entretien partialUpdatedEntretien = new Entretien();
        partialUpdatedEntretien.setId(entretien.getId());

        partialUpdatedEntretien
            .dateentretient(UPDATED_DATEENTRETIENT)
            .resultat(UPDATED_RESULTAT)
            .confirmationresponsable(UPDATED_CONFIRMATIONRESPONSABLE)
            .confirmationsalarie(UPDATED_CONFIRMATIONSALARIE);

        restEntretienMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, partialUpdatedEntretien.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(partialUpdatedEntretien))
            )
            .andExpect(status().isOk());

        // Validate the Entretien in the database
        List<Entretien> entretienList = entretienRepository.findAll();
        assertThat(entretienList).hasSize(databaseSizeBeforeUpdate);
        Entretien testEntretien = entretienList.get(entretienList.size() - 1);
        assertThat(testEntretien.getDateentretient()).isEqualTo(UPDATED_DATEENTRETIENT);
        assertThat(testEntretien.getResultat()).isEqualTo(UPDATED_RESULTAT);
        assertThat(testEntretien.getConfirmationresponsable()).isEqualTo(UPDATED_CONFIRMATIONRESPONSABLE);
        assertThat(testEntretien.getConfirmationsalarie()).isEqualTo(UPDATED_CONFIRMATIONSALARIE);
    }

    @Test
    @Transactional
    void patchNonExistingEntretien() throws Exception {
        int databaseSizeBeforeUpdate = entretienRepository.findAll().size();
        entretien.setId(count.incrementAndGet());

        // If the entity doesn't have an ID, it will throw BadRequestAlertException
        restEntretienMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, entretien.getId())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(entretien))
            )
            .andExpect(status().isBadRequest());

        // Validate the Entretien in the database
        List<Entretien> entretienList = entretienRepository.findAll();
        assertThat(entretienList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithIdMismatchEntretien() throws Exception {
        int databaseSizeBeforeUpdate = entretienRepository.findAll().size();
        entretien.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEntretienMockMvc
            .perform(
                patch(ENTITY_API_URL_ID, count.incrementAndGet())
                    .contentType("application/merge-patch+json")
                    .content(TestUtil.convertObjectToJsonBytes(entretien))
            )
            .andExpect(status().isBadRequest());

        // Validate the Entretien in the database
        List<Entretien> entretienList = entretienRepository.findAll();
        assertThat(entretienList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void patchWithMissingIdPathParamEntretien() throws Exception {
        int databaseSizeBeforeUpdate = entretienRepository.findAll().size();
        entretien.setId(count.incrementAndGet());

        // If url ID doesn't match entity ID, it will throw BadRequestAlertException
        restEntretienMockMvc
            .perform(
                patch(ENTITY_API_URL).contentType("application/merge-patch+json").content(TestUtil.convertObjectToJsonBytes(entretien))
            )
            .andExpect(status().isMethodNotAllowed());

        // Validate the Entretien in the database
        List<Entretien> entretienList = entretienRepository.findAll();
        assertThat(entretienList).hasSize(databaseSizeBeforeUpdate);
    }

    @Test
    @Transactional
    void deleteEntretien() throws Exception {
        // Initialize the database
        entretienRepository.saveAndFlush(entretien);

        int databaseSizeBeforeDelete = entretienRepository.findAll().size();

        // Delete the entretien
        restEntretienMockMvc
            .perform(delete(ENTITY_API_URL_ID, entretien.getId()).accept(MediaType.APPLICATION_JSON))
            .andExpect(status().isNoContent());

        // Validate the database contains one less item
        List<Entretien> entretienList = entretienRepository.findAll();
        assertThat(entretienList).hasSize(databaseSizeBeforeDelete - 1);
    }
}
