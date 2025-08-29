-- DropForeignKey
ALTER TABLE `car` DROP FOREIGN KEY `car_ibfk_1`;

-- DropForeignKey
ALTER TABLE `favoriteChargingStation` DROP FOREIGN KEY `favoriteChargingStation_ibfk_1`;

-- DropForeignKey
ALTER TABLE `favoriteChargingStation` DROP FOREIGN KEY `favoriteChargingStation_ibfk_2`;

-- DropForeignKey
ALTER TABLE `reservations` DROP FOREIGN KEY `reservations_ibfk_1`;

-- DropForeignKey
ALTER TABLE `reservations` DROP FOREIGN KEY `reservations_ibfk_2`;

-- AddForeignKey
ALTER TABLE `car` ADD CONSTRAINT `car_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `favoriteChargingStation` ADD CONSTRAINT `favoriteChargingStation_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `favoriteChargingStation` ADD CONSTRAINT `favoriteChargingStation_ibfk_2` FOREIGN KEY (`chargingStation_id`) REFERENCES `chargingStation`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `reservations` ADD CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `reservations` ADD CONSTRAINT `reservations_ibfk_2` FOREIGN KEY (`chargingStation_id`) REFERENCES `chargingStation`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
