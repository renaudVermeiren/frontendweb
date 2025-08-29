-- CreateTable
CREATE TABLE `EVCharger` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `chargingStation_id` INTEGER NULL,
    `name` VARCHAR(255) NULL,
    `connectorType` VARCHAR(255) NULL,
    `chargeTime` INTEGER NULL,
    `rangePerHour` VARCHAR(255) NULL,
    `userCase` VARCHAR(255) NULL,

    INDEX `chargingStation_id`(`chargingStation_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `address` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `houseNumber` INTEGER NULL,
    `streetName` VARCHAR(255) NULL,
    `city_id` INTEGER NULL,

    INDEX `city_id`(`city_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `car` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `carModel` VARCHAR(255) NULL,
    `year` INTEGER NULL,
    `numberPlate` VARCHAR(255) NULL,
    `user_id` INTEGER NULL,
    `capacity` VARCHAR(255) NULL,

    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `chargingStation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `address_id` INTEGER NULL,
    `numberOfSpaces` INTEGER NULL,

    INDEX `address_id`(`address_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `city` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `postalCode` INTEGER NULL,
    `name` VARCHAR(255) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `favoriteChargingStation` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user_id` INTEGER NULL,
    `chargingStation_id` INTEGER NULL,

    INDEX `chargingStation_id`(`chargingStation_id`),
    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `reservations` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `chargingStation_id` INTEGER NULL,
    `user_id` INTEGER NULL,
    `startReservation` DATETIME(0) NULL,
    `endReservation` DATETIME(0) NULL,

    INDEX `chargingStation_id`(`chargingStation_id`),
    INDEX `user_id`(`user_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NULL,
    `homeAddress_id` INTEGER NULL,

    INDEX `homeAddress_id`(`homeAddress_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `TEST` (
    `id` INTEGER NOT NULL,
    `testtabel` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `EVCharger` ADD CONSTRAINT `EVCharger_ibfk_1` FOREIGN KEY (`chargingStation_id`) REFERENCES `chargingStation`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `address` ADD CONSTRAINT `address_ibfk_1` FOREIGN KEY (`city_id`) REFERENCES `city`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `car` ADD CONSTRAINT `car_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `chargingStation` ADD CONSTRAINT `chargingStation_ibfk_1` FOREIGN KEY (`address_id`) REFERENCES `address`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `favoriteChargingStation` ADD CONSTRAINT `favoriteChargingStation_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `favoriteChargingStation` ADD CONSTRAINT `favoriteChargingStation_ibfk_2` FOREIGN KEY (`chargingStation_id`) REFERENCES `chargingStation`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `reservations` ADD CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `reservations` ADD CONSTRAINT `reservations_ibfk_2` FOREIGN KEY (`chargingStation_id`) REFERENCES `chargingStation`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`homeAddress_id`) REFERENCES `address`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
