package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.Etablissement;
import com.mycompany.myapp.repository.EtablissementRepository;
import com.mycompany.myapp.service.EtablissementService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Etablissement}.
 */
@Service
@Transactional
public class EtablissementServiceImpl implements EtablissementService {

    private final Logger log = LoggerFactory.getLogger(EtablissementServiceImpl.class);

    private final EtablissementRepository etablissementRepository;

    public EtablissementServiceImpl(EtablissementRepository etablissementRepository) {
        this.etablissementRepository = etablissementRepository;
    }

    @Override
    public Etablissement save(Etablissement etablissement) {
        log.debug("Request to save Etablissement : {}", etablissement);
        return etablissementRepository.save(etablissement);
    }

    @Override
    public Etablissement update(Etablissement etablissement) {
        log.debug("Request to save Etablissement : {}", etablissement);
        return etablissementRepository.save(etablissement);
    }

    @Override
    public Optional<Etablissement> partialUpdate(Etablissement etablissement) {
        log.debug("Request to partially update Etablissement : {}", etablissement);

        return etablissementRepository
            .findById(etablissement.getId())
            .map(existingEtablissement -> {
                if (etablissement.getNometablissement() != null) {
                    existingEtablissement.setNometablissement(etablissement.getNometablissement());
                }
                if (etablissement.getManager() != null) {
                    existingEtablissement.setManager(etablissement.getManager());
                }
                if (etablissement.getTeamlead() != null) {
                    existingEtablissement.setTeamlead(etablissement.getTeamlead());
                }

                return existingEtablissement;
            })
            .map(etablissementRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Etablissement> findAll() {
        log.debug("Request to get all Etablissements");
        return etablissementRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Etablissement> findOne(Long id) {
        log.debug("Request to get Etablissement : {}", id);
        return etablissementRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Etablissement : {}", id);
        etablissementRepository.deleteById(id);
    }
}
