/*
  Warnings:

  - Made the column `user_id` on table `car` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `car` DROP FOREIGN KEY `car_ibfk_1`;

-- AlterTable
ALTER TABLE `car` MODIFY `user_id` INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE `car` ADD CONSTRAINT `car_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION;
