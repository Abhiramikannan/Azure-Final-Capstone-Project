package com.Natwest.project.user.service;

import com.Natwest.project.user.model.LoginRequest;
import com.Natwest.project.user.model.User;
import com.Natwest.project.user.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository mockUserRepository;

    private UserService userServiceUnderTest;

    @BeforeEach
    void setUp() {
        userServiceUnderTest = new UserService(mockUserRepository);
    }



    @Test
    void testGetAllUsers() {
        // Setup
        final List<User> expectedResult = List.of(User.builder()
                .userID("userID")
                .username("username")
                .password("password")
                .email("email")
                .firstName("firstName")
                .lastName("lastName")
                .dateOfBirth(new GregorianCalendar(2020, Calendar.JANUARY, 1).getTime())
                .address("address")
                .phoneNumber("phoneNumber")
                .profilePictureUrl("profilePictureUrl")
                .registrationDate(new GregorianCalendar(2020, Calendar.JANUARY, 1).getTime())
                .build());

        // Configure UserRepository.findAll(...).
        final List<User> users = List.of(User.builder()
                .userID("userID")
                .username("username")
                .password("password")
                .email("email")
                .firstName("firstName")
                .lastName("lastName")
                .dateOfBirth(new GregorianCalendar(2020, Calendar.JANUARY, 1).getTime())
                .address("address")
                .phoneNumber("phoneNumber")
                .profilePictureUrl("profilePictureUrl")
                .registrationDate(new GregorianCalendar(2020, Calendar.JANUARY, 1).getTime())
                .build());
        when(mockUserRepository.findAll()).thenReturn(users);

        // Run the test
        final List<User> result = userServiceUnderTest.getAllUsers();

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
    }

    @Test
    void testGetAllUsers_UserRepositoryReturnsNoItems() {
        // Setup
        when(mockUserRepository.findAll()).thenReturn(Collections.emptyList());

        // Run the test
        final List<User> result = userServiceUnderTest.getAllUsers();

        // Verify the results
        assertThat(result).isEqualTo(Collections.emptyList());
    }

    @Test
    void testGetUserById() {
        // Setup
        final Optional<User> expectedResult = Optional.of(User.builder()
                .userID("userID")
                .username("username")
                .password("password")
                .email("email")
                .firstName("firstName")
                .lastName("lastName")
                .dateOfBirth(new GregorianCalendar(2020, Calendar.JANUARY, 1).getTime())
                .address("address")
                .phoneNumber("phoneNumber")
                .profilePictureUrl("profilePictureUrl")
                .registrationDate(new GregorianCalendar(2020, Calendar.JANUARY, 1).getTime())
                .build());

        // Configure UserRepository.findByUserID(...).
        final Optional<User> user = Optional.of(User.builder()
                .userID("userID")
                .username("username")
                .password("password")
                .email("email")
                .firstName("firstName")
                .lastName("lastName")
                .dateOfBirth(new GregorianCalendar(2020, Calendar.JANUARY, 1).getTime())
                .address("address")
                .phoneNumber("phoneNumber")
                .profilePictureUrl("profilePictureUrl")
                .registrationDate(new GregorianCalendar(2020, Calendar.JANUARY, 1).getTime())
                .build());
        when(mockUserRepository.findByUserID("userID")).thenReturn(user);

        // Run the test
        final Optional<User> result = userServiceUnderTest.getUserById("userID");

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
    }

    @Test
    void testGetUserById_UserRepositoryReturnsAbsent() {
        // Setup
        when(mockUserRepository.findByUserID("userID")).thenReturn(Optional.empty());

        // Run the test
        final Optional<User> result = userServiceUnderTest.getUserById("userID");

        // Verify the results
        assertThat(result).isEmpty();
    }

    @Test
    void testUpdateUser() {
        // Setup
        final User updatedUser = User.builder()
                .userID("userID")
                .username("username")
                .password("password")
                .email("email")
                .firstName("firstName")
                .lastName("lastName")
                .dateOfBirth(new GregorianCalendar(2020, Calendar.JANUARY, 1).getTime())
                .address("address")
                .phoneNumber("phoneNumber")
                .profilePictureUrl("profilePictureUrl")
                .registrationDate(new GregorianCalendar(2020, Calendar.JANUARY, 1).getTime())
                .build();
        final User expectedResult = User.builder()
                .userID("userID")
                .username("username")
                .password("password")
                .email("email")
                .firstName("firstName")
                .lastName("lastName")
                .dateOfBirth(new GregorianCalendar(2020, Calendar.JANUARY, 1).getTime())
                .address("address")
                .phoneNumber("phoneNumber")
                .profilePictureUrl("profilePictureUrl")
                .registrationDate(new GregorianCalendar(2020, Calendar.JANUARY, 1).getTime())
                .build();

        // Configure UserRepository.findById(...).
        final Optional<User> user = Optional.of(User.builder()
                .userID("userID")
                .username("username")
                .password("password")
                .email("email")
                .firstName("firstName")
                .lastName("lastName")
                .dateOfBirth(new GregorianCalendar(2020, Calendar.JANUARY, 1).getTime())
                .address("address")
                .phoneNumber("phoneNumber")
                .profilePictureUrl("profilePictureUrl")
                .registrationDate(new GregorianCalendar(2020, Calendar.JANUARY, 1).getTime())
                .build());
        when(mockUserRepository.findById("userID")).thenReturn(user);

        // Configure UserRepository.save(...).
        final User user1 = User.builder()
                .userID("userID")
                .username("username")
                .password("password")
                .email("email")
                .firstName("firstName")
                .lastName("lastName")
                .dateOfBirth(new GregorianCalendar(2020, Calendar.JANUARY, 1).getTime())
                .address("address")
                .phoneNumber("phoneNumber")
                .profilePictureUrl("profilePictureUrl")
                .registrationDate(new GregorianCalendar(2020, Calendar.JANUARY, 1).getTime())
                .build();
        when(mockUserRepository.save(User.builder()
                .userID("userID")
                .username("username")
                .password("password")
                .email("email")
                .firstName("firstName")
                .lastName("lastName")
                .dateOfBirth(new GregorianCalendar(2020, Calendar.JANUARY, 1).getTime())
                .address("address")
                .phoneNumber("phoneNumber")
                .profilePictureUrl("profilePictureUrl")
                .registrationDate(new GregorianCalendar(2020, Calendar.JANUARY, 1).getTime())
                .build())).thenReturn(user1);

        // Run the test
        final User result = userServiceUnderTest.updateUser("userID", updatedUser);

        // Verify the results
        assertThat(result).isEqualTo(expectedResult);
    }

    @Test
    void testUpdateUser_UserRepositoryFindByIdReturnsAbsent() {
        // Setup
        final User updatedUser = User.builder()
                .userID("userID")
                .username("username")
                .password("password")
                .email("email")
                .firstName("firstName")
                .lastName("lastName")
                .dateOfBirth(new GregorianCalendar(2020, Calendar.JANUARY, 1).getTime())
                .address("address")
                .phoneNumber("phoneNumber")
                .profilePictureUrl("profilePictureUrl")
                .registrationDate(new GregorianCalendar(2020, Calendar.JANUARY, 1).getTime())
                .build();
        when(mockUserRepository.findById("userID")).thenReturn(Optional.empty());

        // Run the test
        final User result = userServiceUnderTest.updateUser("userID", updatedUser);

        // Verify the results
        assertThat(result).isNull();
    }

    @Test
    void testDeleteUser() {
        // Setup
        // Run the test
        userServiceUnderTest.deleteUser("userID");

        // Verify the results
        verify(mockUserRepository).deleteById("userID");
    }

    @Test
    void testLogin() {
        // Setup
        final LoginRequest loginRequest = new LoginRequest("email", "password");

        // Configure UserRepository.findByEmail(...).
        final User user = User.builder()
                .userID("userID")
                .username("username")
                .password("password")
                .email("email")
                .firstName("firstName")
                .lastName("lastName")
                .dateOfBirth(new GregorianCalendar(2020, Calendar.JANUARY, 1).getTime())
                .address("address")
                .phoneNumber("phoneNumber")
                .profilePictureUrl("profilePictureUrl")
                .registrationDate(new GregorianCalendar(2020, Calendar.JANUARY, 1).getTime())
                .build();
        when(mockUserRepository.findByEmail("email")).thenReturn(user);

        // Run the test
        final String result = userServiceUnderTest.login(loginRequest);

        // Verify the results
        assertThat(result).isEqualTo("userID");
    }

    @Test
    void testLogin_UserRepositoryReturnsNull() {
        // Setup
        final LoginRequest loginRequest = new LoginRequest("email", "password");
        when(mockUserRepository.findByEmail("email")).thenReturn(null);

        // Run the test
        final String result = userServiceUnderTest.login(loginRequest);

        // Verify the results
        assertThat(result).isNull();
    }
}
