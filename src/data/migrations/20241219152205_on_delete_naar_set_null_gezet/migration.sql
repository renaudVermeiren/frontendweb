-- DropForeignKey
ALTER TABLE `EVCharger` DROP FOREIGN KEY `EVCharger_ibfk_1`;

-- DropForeignKey
ALTER TABLE `address` DROP FOREIGN KEY `address_ibfk_1`;

-- DropForeignKey
ALTER TABLE `chargingStation` DROP FOREIGN KEY `chargingStation_ibfk_1`;

-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `user_ibfk_1`;

-- AddForeignKey
ALTER TABLE `EVCharger` ADD CONSTRAINT `EVCharger_ibfk_1` FOREIGN KEY (`chargingStation_id`) REFERENCES `chargingStation`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `address` ADD CONSTRAINT `address_ibfk_1` FOREIGN KEY (`city_id`) REFERENCES `city`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `chargingStation` ADD CONSTRAINT `chargingStation_ibfk_1` FOREIGN KEY (`address_id`) REFERENCES `address`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `user` ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`homeAddress_id`) REFERENCES `address`(`id`) ON DELETE SET NULL ON UPDATE NO ACTION;
