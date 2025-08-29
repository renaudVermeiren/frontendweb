/*
  Warnings:

  - Made the column `user_id` on table `favoriteChargingStation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `chargingStation_id` on table `favoriteChargingStation` required. This step will fail if there are existing NULL values in that column.
  - Made the column `chargingStation_id` on table `reservations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `user_id` on table `reservations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `startReservation` on table `reservations` required. This step will fail if there are existing NULL values in that column.
  - Made the column `endReservation` on table `reservations` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `favoriteChargingStation` DROP FOREIGN KEY `favoriteChargingStation_ibfk_1`;

-- DropForeignKey
ALTER TABLE `favoriteChargingStation` DROP FOREIGN KEY `favoriteChargingStation_ibfk_2`;

-- DropForeignKey
ALTER TABLE `reservations` DROP FOREIGN KEY `reservations_ibfk_1`;

-- DropForeignKey
ALTER TABLE `reservations` DROP FOREIGN KEY `reservations_ibfk_2`;

-- AlterTable
ALTER TABLE `favoriteChargingStation` MODIFY `user_id` INTEGER NOT NULL,
    MODIFY `chargingStation_id` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `reservations` MODIFY `chargingStation_id` INTEGER NOT NULL,
    MODIFY `user_id` INTEGER NOT NULL,
    MODIFY `startReservation` DATETIME(0) NOT NULL,
    MODIFY `endReservation` DATETIME(0) NOT NULL;

-- CreateTable
CREATE TABLE `testmodel` (
    `id` INTEGER NOT NULL,
    `naam` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `favoriteChargingStation` ADD CONSTRAINT `favoriteChargingStation_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `favoriteChargingStation` ADD CONSTRAINT `favoriteChargingStation_ibfk_2` FOREIGN KEY (`chargingStation_id`) REFERENCES `chargingStation`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `reservations` ADD CONSTRAINT `reservations_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE `reservations` ADD CONSTRAINT `reservations_ibfk_2` FOREIGN KEY (`chargingStation_id`) REFERENCES `chargingStation`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
