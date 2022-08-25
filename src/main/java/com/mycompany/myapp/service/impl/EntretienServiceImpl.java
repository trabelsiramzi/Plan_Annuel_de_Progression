package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.Entretien;
import com.mycompany.myapp.repository.EntretienRepository;
import com.mycompany.myapp.service.EntretienService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Entretien}.
 */
@Service
@Transactional
public class EntretienServiceImpl implements EntretienService {

    private final Logger log = LoggerFactory.getLogger(EntretienServiceImpl.class);

    private final EntretienRepository entretienRepository;

    public EntretienServiceImpl(EntretienRepository entretienRepository) {
        this.entretienRepository = entretienRepository;
    }

    @Override
    public Entretien save(Entretien entretien) {
        log.debug("Request to save Entretien : {}", entretien);
        return entretienRepository.save(entretien);
    }

    @Override
    public Entretien update(Entretien entretien) {
        log.debug("Request to save Entretien : {}", entretien);
        return entretienRepository.save(entretien);
    }

    @Override
    public Optional<Entretien> partialUpdate(Entretien entretien) {
        log.debug("Request to partially update Entretien : {}", entretien);

        return entretienRepository
            .findById(entretien.getId())
            .map(existingEntretien -> {
                if (entretien.getDateentretient() != null) {
                    existingEntretien.setDateentretient(entretien.getDateentretient());
                }
                if (entretien.getResultat() != null) {
                    existingEntretien.setResultat(entretien.getResultat());
                }
                if (entretien.getConfirmationresponsable() != null) {
                    existingEntretien.setConfirmationresponsable(entretien.getConfirmationresponsable());
                }
                if (entretien.getConfirmationsalarie() != null) {
                    existingEntretien.setConfirmationsalarie(entretien.getConfirmationsalarie());
                }

                return existingEntretien;
            })
            .map(entretienRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Entretien> findAll() {
        log.debug("Request to get all Entretiens");
        return entretienRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Entretien> findOne(Long id) {
        log.debug("Request to get Entretien : {}", id);
        return entretienRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Entretien : {}", id);
        entretienRepository.deleteById(id);
    }
}
