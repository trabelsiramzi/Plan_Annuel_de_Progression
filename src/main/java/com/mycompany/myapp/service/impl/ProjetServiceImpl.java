package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.Projet;
import com.mycompany.myapp.repository.ProjetRepository;
import com.mycompany.myapp.service.ProjetService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Projet}.
 */
@Service
@Transactional
public class ProjetServiceImpl implements ProjetService {

    private final Logger log = LoggerFactory.getLogger(ProjetServiceImpl.class);

    private final ProjetRepository projetRepository;

    public ProjetServiceImpl(ProjetRepository projetRepository) {
        this.projetRepository = projetRepository;
    }

    @Override
    public Projet save(Projet projet) {
        log.debug("Request to save Projet : {}", projet);
        return projetRepository.save(projet);
    }

    @Override
    public Projet update(Projet projet) {
        log.debug("Request to save Projet : {}", projet);
        return projetRepository.save(projet);
    }

    @Override
    public Optional<Projet> partialUpdate(Projet projet) {
        log.debug("Request to partially update Projet : {}", projet);

        return projetRepository
            .findById(projet.getId())
            .map(existingProjet -> {
                if (projet.getTitreprojet() != null) {
                    existingProjet.setTitreprojet(projet.getTitreprojet());
                }

                return existingProjet;
            })
            .map(projetRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Projet> findAll() {
        log.debug("Request to get all Projets");
        return projetRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Projet> findOne(Long id) {
        log.debug("Request to get Projet : {}", id);
        return projetRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Projet : {}", id);
        projetRepository.deleteById(id);
    }
}
