-- CreateTable
CREATE TABLE `MachineReading` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `machineId` INTEGER NOT NULL,
    `status` ENUM('RUNNING', 'STOPPED', 'MAINTENANCE', 'ERROR') NOT NULL,
    `temperature` DOUBLE NOT NULL,
    `productionCount` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `MachineReading_machineId_createdAt_idx`(`machineId`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `MachineReading` ADD CONSTRAINT `MachineReading_machineId_fkey` FOREIGN KEY (`machineId`) REFERENCES `Machine`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
