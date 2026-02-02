package com.pokepoke.arch;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.data.jpa.repository.config.EnableJpaAuditing;

@EnableJpaAuditing // 이 부분이 있어야 시간이 자동으로 들어감
@SpringBootApplication
public class ArchApplication {

	public static void main(String[] args) {
		SpringApplication.run(ArchApplication.class, args);
	}

}
