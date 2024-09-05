package com.Natwest.project.esg.service;

import com.Natwest.project.esg.entity.Esg;
import com.Natwest.project.esg.repo.EsgRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Collections;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class EsgServiceTest {

    @Mock
    private EsgRepository mockEsgRepo;

    private EsgService esgServiceUnderTest;

    @BeforeEach
    void setUp() {
        esgServiceUnderTest = new EsgService();
        esgServiceUnderTest.esgRepo = mockEsgRepo;
    }

    @Test
    void testSaveEsg() {
        // Setup
        final Esg esg = new Esg();
        esg.setId("id");
        esg.setLink("link");
        esg.setCategory("category");
        esg.setImage("image");
        esg.setTitle("title");

        // Run the test
        final String result = esgServiceUnderTest.saveEsg(esg);

        // Verify the results
        assertThat(result).isEqualTo("Data is saved successfully");

        // Confirm EsgRepository.save(...).
        final Esg entity = new Esg();
        entity.setId("id");
        entity.setLink("link");
        entity.setCategory("category");
        entity.setImage("image");
        entity.setTitle("title");
        verify(mockEsgRepo).save(entity);
    }

    @Test
    void testGetAllEsg() {
        // Setup
        final Esg esg = new Esg();
        esg.setId("id");
        esg.setLink("link");
        esg.setCategory("category");
        esg.setImage("image");
        esg.setTitle("title");
        final List<Esg> expectedResult = List.of(esg);

        // Configure EsgRepository.findAll(...).
        final Esg esg1 = new Esg();
        esg1.setId("id");
        esg1.setLink("link");
        esg1.setCategory("category");
        esg1.setImage("image");
        esg1.setTitle("title");
        final List<Esg> esgs = List.of(esg1);
        when(mockEsgRepo.findAll()).thenReturn(esgs);

        // Run the test
        final List<Esg> result = esgServiceUnderTest.getAllEsg();

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
    }

    @Test
    void testGetAllEsg_EsgRepositoryReturnsNoItems() {
        // Setup
        when(mockEsgRepo.findAll()).thenReturn(Collections.emptyList());

        // Run the test
        final List<Esg> result = esgServiceUnderTest.getAllEsg();

        // Verify the results
        assertThat(result).isEqualTo(Collections.emptyList());
    }
}
