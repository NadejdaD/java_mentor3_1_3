package web.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import web.model.Role;
import web.model.User;
import web.service.UserService;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

@RestController
@RequestMapping("/admin/")
public class AdminController {
    private UserService userService;

    @Autowired
    public AdminController(UserService userService) {
        this.userService = userService;
    }


    @GetMapping("/home")
    public ResponseEntity<List<User>> showUsers() {
        return new ResponseEntity<>(userService.getAllUsers(), HttpStatus.OK);
    }

    @GetMapping("/infoAdmin")
    public ResponseEntity<User> showInfoAdmin() {
        User user = (User) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return new ResponseEntity<>(user, HttpStatus.OK);
    }

    @PostMapping("/addUser")
    public ResponseEntity<User> addUser(@RequestBody User user) {
        userService.saveUser(user);
        return new ResponseEntity<>(HttpStatus.CREATED);
    }

    @DeleteMapping("/delete")
    public ResponseEntity<List<User>> deleteUser(@RequestBody User user) {
        userService.deleteUser(user.getId());
        return new ResponseEntity<>(userService.getAllUsers(), HttpStatus.OK);
    }

    @PutMapping("/edit")
    public ResponseEntity<List<User>> editUser(@RequestBody User userForm) {
        Set<Role> roleSet = new HashSet<>();
        roleSet.add(userService.getRoleById(1L));

        if (userForm.getRoles().iterator().next().getName().contains("ROLE_ADMIN")) {
            roleSet.add(userService.getRoleById(2L));
        } else if (userForm.getRoles().iterator().next().getName().contains("ROLE_USER")) {
            roleSet.add(userService.getRoleById(1L));
        }
        userForm.setRoles(roleSet);
        userService.editUser(userForm);
        return new ResponseEntity<>(userService.getAllUsers(), HttpStatus.OK);
    }
}
