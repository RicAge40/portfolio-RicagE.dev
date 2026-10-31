<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Mailer\Exception\TransportExceptionInterface;
use Symfony\Component\Mailer\MailerInterface;
use Symfony\Component\Mime\Address;
use Symfony\Component\Mime\Email;
use Symfony\Component\Routing\Attribute\Route;

final class HomeController extends AbstractController
{
    #[Route('/', name: 'app_home', methods: ['GET', 'POST'])]
    public function index(
        Request $request,
        MailerInterface $mailer,
    ): Response {
        $errors = [];
        $values = [
            'name' => '',
            'email' => '',
            'company' => '',
            'phone' => '',
            'message' => '',
        ];

        if ($request->isMethod('POST')) {
            $data = $request->request->all();

            foreach ($values as $key => $value) {
                $values[$key] = is_string($data[$key] ?? null)
                    ? trim($data[$key])
                    : '';
            }

            $token = is_string($data['_token'] ?? null)
                ? $data['_token']
                : '';

            if (!$this->isCsrfTokenValid('contact', $token)) {
                $errors[] = 'La session a expiré. Réessayez.';
            }

            if (
                $values['name'] === ''
                || mb_strlen($values['name']) > 150
            ) {
                $errors[] = 'Indiquez un nom de 150 caractères maximum.';
            }

            if (
                mb_strlen($values['email']) > 254
                || !filter_var($values['email'], FILTER_VALIDATE_EMAIL)
            ) {
                $errors[] = 'Indiquez une adresse e-mail valide.';
            }

            if (
                mb_strlen($values['company']) > 150
                || mb_strlen($values['phone']) > 40
            ) {
                $errors[] = 'Le nom d’entreprise ou le téléphone est trop long.';
            }

            if (
                $values['message'] === ''
                || mb_strlen($values['message']) > 10000
            ) {
                $errors[] = 'Votre message doit contenir entre 1 et 10 000 caractères.';
            }

            if ($errors === []) {
                $email = (new Email())
                    ->from(new Address(
                        $this->getParameter('app.contact_sender'),
                        'RicAgE.dev',
                    ))
                    ->to('ricage.dev@gmail.com')
                    ->replyTo($values['email'])
                    ->subject('Nouvelle demande — portfolio RicAgE.dev')
                    ->text(sprintf(
                        "Nom : %s\nE-mail : %s\nEntreprise : %s\nTéléphone : %s\n\nProjet :\n%s",
                        $values['name'],
                        $values['email'],
                        $values['company'],
                        $values['phone'],
                        $values['message'],
                    ));

                try {
                    $mailer->send($email);

                    $this->addFlash(
                        'contact_success',
                        'Merci ! Votre message a bien été transmis.',
                    );

                    return $this->redirectToRoute('app_home', [
                        '_fragment' => 'contact',
                    ]);
                } catch (TransportExceptionInterface) {
                    $errors[] = 'L’envoi a échoué. Réessayez ou écrivez à ricage.dev@gmail.com.';
                }
            }
        }

        return $this->render('home/index.html.twig', [
            'contactErrors' => $errors,
            'contactValues' => $values,
        ]);
    }
}
