package com.mycompany.myapp.domain;

import static org.assertj.core.api.Assertions.assertThat;

import com.mycompany.myapp.web.rest.TestUtil;
import org.junit.jupiter.api.Test;

class AffectationAdminTest {

    @Test
    void equalsVerifier() throws Exception {
        TestUtil.equalsVerifier(AffectationAdmin.class);
        AffectationAdmin affectationAdmin1 = new AffectationAdmin();
        affectationAdmin1.setId(1L);
        AffectationAdmin affectationAdmin2 = new AffectationAdmin();
        affectationAdmin2.setId(affectationAdmin1.getId());
        assertThat(affectationAdmin1).isEqualTo(affectationAdmin2);
        affectationAdmin2.setId(2L);
        assertThat(affectationAdmin1).isNotEqualTo(affectationAdmin2);
        affectationAdmin1.setId(null);
        assertThat(affectationAdmin1).isNotEqualTo(affectationAdmin2);
    }
}
