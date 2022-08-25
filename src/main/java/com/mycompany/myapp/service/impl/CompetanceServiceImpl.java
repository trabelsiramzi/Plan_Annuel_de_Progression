package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.Competance;
import com.mycompany.myapp.repository.CompetanceRepository;
import com.mycompany.myapp.service.CompetanceService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Competance}.
 */
@Service
@Transactional
public class CompetanceServiceImpl implements CompetanceService {

    private final Logger log = LoggerFactory.getLogger(CompetanceServiceImpl.class);

    private final CompetanceRepository competanceRepository;

    public CompetanceServiceImpl(CompetanceRepository competanceRepository) {
        this.competanceRepository = competanceRepository;
    }

    @Override
    public Competance save(Competance competance) {
        log.debug("Request to save Competance : {}", competance);
        return competanceRepository.save(competance);
    }

    @Override
    public Competance update(Competance competance) {
        log.debug("Request to save Competance : {}", competance);
        return competanceRepository.save(competance);
    }

    @Override
    public Optional<Competance> partialUpdate(Competance competance) {
        log.debug("Request to partially update Competance : {}", competance);

        return competanceRepository
            .findById(competance.getId())
            .map(existingCompetance -> {
                if (competance.getNomCompetance() != null) {
                    existingCompetance.setNomCompetance(competance.getNomCompetance());
                }
                if (competance.getDescription() != null) {
                    existingCompetance.setDescription(competance.getDescription());
                }
                if (competance.getNiveau() != null) {
                    existingCompetance.setNiveau(competance.getNiveau());
                }

                return existingCompetance;
            })
            .map(competanceRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Competance> findAll() {
        log.debug("Request to get all Competances");
        return competanceRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Competance> findOne(Long id) {
        log.debug("Request to get Competance : {}", id);
        return competanceRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Competance : {}", id);
        competanceRepository.deleteById(id);
    }
}
