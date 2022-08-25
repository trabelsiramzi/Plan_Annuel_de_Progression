package com.mycompany.myapp.service.impl;

import com.mycompany.myapp.domain.AffectationAdmin;
import com.mycompany.myapp.repository.AffectationAdminRepository;
import com.mycompany.myapp.service.AffectationAdminService;
import java.util.List;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Service Implementation for managing {@link AffectationAdmin}.
 */
@Service
@Transactional
public class AffectationAdminServiceImpl implements AffectationAdminService {

    private final Logger log = LoggerFactory.getLogger(AffectationAdminServiceImpl.class);

    private final AffectationAdminRepository affectationAdminRepository;

    public AffectationAdminServiceImpl(AffectationAdminRepository affectationAdminRepository) {
        this.affectationAdminRepository = affectationAdminRepository;
    }

    @Override
    public AffectationAdmin save(AffectationAdmin affectationAdmin) {
        log.debug("Request to save AffectationAdmin : {}", affectationAdmin);
        return affectationAdminRepository.save(affectationAdmin);
    }

    @Override
    public AffectationAdmin update(AffectationAdmin affectationAdmin) {
        log.debug("Request to save AffectationAdmin : {}", affectationAdmin);
        return affectationAdminRepository.save(affectationAdmin);
    }

    @Override
    public Optional<AffectationAdmin> partialUpdate(AffectationAdmin affectationAdmin) {
        log.debug("Request to partially update AffectationAdmin : {}", affectationAdmin);

        return affectationAdminRepository
            .findById(affectationAdmin.getId())
            .map(existingAffectationAdmin -> {
                if (affectationAdmin.getDatedebut() != null) {
                    existingAffectationAdmin.setDatedebut(affectationAdmin.getDatedebut());
                }
                if (affectationAdmin.getDatefin() != null) {
                    existingAffectationAdmin.setDatefin(affectationAdmin.getDatefin());
                }

                return existingAffectationAdmin;
            })
            .map(affectationAdminRepository::save);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AffectationAdmin> findAll() {
        log.debug("Request to get all AffectationAdmins");
        return affectationAdminRepository.findAll();
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<AffectationAdmin> findOne(Long id) {
        log.debug("Request to get AffectationAdmin : {}", id);
        return affectationAdminRepository.findById(id);
    }

    @Override
    public void delete(Long id) {
        log.debug("Request to delete AffectationAdmin : {}", id);
        affectationAdminRepository.deleteById(id);
    }
}
