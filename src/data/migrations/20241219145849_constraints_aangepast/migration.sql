-- DropForeignKey
ALTER TABLE `chargingStation` DROP FOREIGN KEY `chargingStation_ibfk_1`;

-- AddForeignKey
ALTER TABLE `chargingStation` ADD CONSTRAINT `chargingStation_ibfk_1` FOREIGN KEY (`address_id`) REFERENCES `address`(`id`) ON DELETE CASCADE ON UPDATE NO ACTION;
