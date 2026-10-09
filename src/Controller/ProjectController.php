<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

final class ProjectController extends AbstractController
{
    #[Route('/projets/{slug}', name: 'app_project_show')]
    public function show(string $slug): Response
    {
        $projects = [
            'humain' => [
                'number' => '#01',
                'slug' => 'humain',
                'title' => 'HUMAIN',
                'description' => 'Site artistique immersif & administration sur mesure.',
                'stack' => 'Symfony · Twig · GSAP · EasyAdmin',
                'image' => 'images/projets/Mask.jpg',
                'imageAlt' => 'Aperçu du site HUMAIN',
                'intro' => 'Création d’un site artistique immersif associant design sur mesure, animations GSAP et contenus multimédias.',
                'features' => 'Une administration sécurisée permet à l’artiste de gérer ses photos, musiques, vidéos, événements, demandes de booking et newsletters en toute autonomie.',
                'adminImage' => 'images/projets/humain-admin.png',
                'website' => null,
            ],
        ];

        if (!isset($projects[$slug])) {
            throw $this->createNotFoundException('Projet introuvable.');
        }

        return $this->render('project/show.html.twig', [
            'project' => $projects[$slug],
        ]);
    }
}
