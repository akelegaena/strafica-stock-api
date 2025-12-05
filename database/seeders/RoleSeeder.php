<?php

namespace Database\Seeders;

use App\Models\Role;
use App\Models\User;
use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    public function run()
    {
        $admin = Role::create(['nom' => 'ADMIN']);
        $employe = Role::create(['nom' => 'EMPLOYE']);

        User::create([
            'name' => 'Super Admin',
            'email' => 'admin@strafrica.com',
            'password' => bcrypt('admin123'),
            'role_id' => $admin->id,
        ]);
    }
}
