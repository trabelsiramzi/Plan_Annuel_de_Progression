package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.Responsable;
import com.mycompany.myapp.repository.ResponsableRepository;
import com.mycompany.myapp.service.ResponsableService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link Responsable}.
 */
@Service
@Transactional
public class ResponsableServiceImpl implements ResponsableService {

    private final Logger log = LoggerFactory.getLogger(ResponsableServiceImpl.class);

    private final ResponsableRepository responsableRepository;

    public ResponsableServiceImpl(ResponsableRepository responsableRepository) {
        this.responsableRepository = responsableRepository;
    }

    @Override
    public Responsable save(Responsable responsable) {
        log.debug("Request to save Responsable : {}", responsable);
        return responsableRepository.save(responsable);
    }

    @Override
    public Responsable update(Responsable responsable) {
        log.debug("Request to save Responsable : {}", responsable);
        return responsableRepository.save(responsable);
    }

    @Override
    public Optional<Responsable> partialUpdate(Responsable responsable) {
        log.debug("Request to partially update Responsable : {}", responsable);

        return responsableRepository
            .findById(responsable.getId())
            .map(existingResponsable -> {
                if (responsable.getNommanager() != null) {
                    existingResponsable.setNommanager(responsable.getNommanager());
                }
                if (responsable.getNomteamlead() != null) {
                    existingResponsable.setNomteamlead(responsable.getNomteamlead());
                }

                return existingResponsable;
            })
            .map(responsableRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Responsable> findAll() {
        log.debug("Request to get all Responsables");
        return responsableRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<Responsable> findOne(Long id) {
        log.debug("Request to get Responsable : {}", id);
        return responsableRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete Responsable : {}", id);
        responsableRepository.deleteById(id);
    }
}
