<?php

namespace App\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\RequestStack;
use Symfony\Component\HttpFoundation\Session\Session;
//use App\Controller\ParentController;
use Doctrine\Persistence\ManagerRegistry;

use Psr\Log\LoggerInterface;
use Doctrine\DBAL\Connection;

use App\Entity\CountryName;
use App\Repository\CountryNameRepository;
use App\Entity\CityName;
use App\Repository\CityNameRepository;
use App\Entity\HotelPhoto;
use App\Repository\HotelPhotoRepository;
use App\Entity\AccessToken;
use App\Entity\User;

use App\Service\ControllerService;
use App\Util\Util;
use App\Util\Bank;


class MainController extends AbstractController
{
    private $connection;
    private $logger;
    private $util;
    private $service;
    private $requestStack;

    public function __construct(LoggerInterface $logger, Connection $connection, RequestStack $requestStack)
    {
        $this->logger = $logger;
        $this->connection = $connection;
        $this->util = new Util();
        $this->service = new ControllerService($logger);
        $this->requestStack = $requestStack;
    }
    
    /**
     * @Route("/", name="main")
     */
    public function main()
    {
//        return $this->forward('App\Controller\MainController::home');
        $request = Request::createFromGlobals();
        $logStep = 0;
        $tagName = 'home->getCountryList()';
        $logId = 'client_ip='.$request->getClientIp();
        
        $this->logger->info('================================================');
        $this->logger->info($this->util->generateLogMessage($tagName, $logId, $logStep, 'START'));
        
        if($this->service->is_prod == true){  
            $LENDCODE = $request->get('code');
            $this->logger->info('PRODUCTION MODE - LEND EMBEDDED CODE: '.$LENDCODE);
        }else{
            $LENDCODE = 'YzhmNTk1NDg5MGI3YmZmMTA4NTZjZWVmYTkyMmZmZDFkNDc5MzE1NTkzMTAzNTIyY2M5NTczMGVjNmJhZjYzYQ';
            $this->logger->info('LOCAL MODE - LEND EMBEDDED CODE: '.$LENDCODE);
        }
        
        if($this->service->is_prod == true){ 
            if(!$this->util->isValidAccess($this->logger, $request->headers->get('User-Agent'), $logId, $LENDCODE)){
                return $this->render('main/landing.html.twig');
            }
        }

        $session = $this->requestStack->getSession();
        if($session->get('lendcode_session')){
            $this->logger->info("HAS LENDCODE SESSION. ID=".$session->getId());
            $session->remove('lendcode_session');
            $this->logger->info("REMOVED LENDCODE SESSION. ID=".$session->getId());
        }
        
        $session->set('lendcode_session', array(
            'code' => $LENDCODE
        ));
        
        $this->logger->info($this->util->generateLogMessage($tagName, $logId, $logStep, 'END'));
        
        $result = array(
            // 'code' => $LENDCODE,
            'year' => date("Y"),
        );
        return $this->render('main/splash.html.twig', $result);
    }
    
    /**
     * @Route("/home", name="home")
     */
    public function home(ManagerRegistry $doctrine)
    {
        $this->logger->info('================================================');
        $request = Request::createFromGlobals();
        
        $logStep = 0;
        $tagName = 'home->getCountryList()';
        $logId = 'client_ip='.$request->getClientIp();
        
        $this->logger->info($this->util->generateLogMessage($tagName, $logId, $logStep, 'START'));
        
        // $response = json_decode($request->getContent(), true);
        // $request->request->replace(is_array($response) ? $response : array());
        // $LENDCODE = $response['code'];

        $session = $this->requestStack->getSession();
        $LENDCODE = $session->get('lendcode_session')['code'];

//        $startTime = new \DateTime('10:00:00');
//        $endTime = new \DateTime('20:00:00');
//        $dateTime = new \DateTime();
//        $now = $dateTime->format('H:i:s');
//        
//        
//        
//        $sTime = new \DateTime($startTime);
//        $eTime = new \DateTime($endTime);
//        $n = new \DateTime($now);
//        
//        
//        $this->logger->info("Одоо цаг: ".$now);
//
//        if ($sTime > $n) {
//            $this->logger->info("10-с бага");
//        }else if ($eTime < $n){
//            $this->logger->info("20-с их");
//        }
//            
//        if ($startTime < $now && $now < $endTime) {
//            $this->logger->info("Захиалга боломжтой");
//        }else{
//            $this->logger->info("Захиалга боломжгүй");
//        }
//        
//        $interval = date_create('now')->diff( $startTime );
//        $this->logger->info("Цагийн зөрүү: ".var_export($interval, true));
//        
    
        
        if($this->service->is_prod == true){  
            // $LENDCODE = $request->get('code');
            $this->logger->info('PRODUCTION MODE - LEND EMBEDDED CODE: '.$LENDCODE);
        }else{
            // $LENDCODE = 'YzhmNTk1NDg5MGI3YmZmMTA4NTZjZWVmYTkyMmZmZDFkNDc5MzE1NTkzMTAzNTIyY2M5NTczMGVjNmJhZjYzYQ';
            $this->logger->info('LOCAL MODE - LEND EMBEDDED CODE: '.$LENDCODE);
        }

        if(!empty($LENDCODE)){ // new access
            $lendAccessToken = $this->service->getLendAccessToken($LENDCODE, $request);
            $userInfo = $this->service->getUserInfo($lendAccessToken['accessToken'], $request);

            $this->logger->info("ACCESS TOKEN RESULT:: ".var_export($lendAccessToken, true));
            $this->logger->info("USER INFO RESULT:: ".var_export($userInfo, true));
             
            if($lendAccessToken && $userInfo){
                $entityManager = $doctrine->getManager();
                $repository = $entityManager->getRepository(User::class);
                $user = $repository->findUserByAccountID($userInfo['userId']);
        
                if($user == null){ // new user
                    $userID = $this->service->saveUserInfo($userInfo, $request, $doctrine->getManager());
//                  $tokenID = $this->service->saveAccessToken($lendAccessToken, $userID, $request, $entityManager);
                }
                
                $session = $this->requestStack->getSession();
                if($session->get('user_session')){
                    $this->logger->info("HAS SESSION. ID=".$session->getId());
                    $session->remove('user_session');
                    $this->logger->info("REMOVED SESSION. ID=".$session->getId());
                }
                
                $session->set('user_session', array(
                    'user_id' => $userInfo['userId'],
                    'user_phone' => $userInfo['phoneNumber'],
                    'access_token' => $lendAccessToken['accessToken'],
                ));
                
                // requestStack id нь хэрэв өөр байдаг бол хэрэглэгчийн USER TABLE -д ID -г хадгаламж requestStack шалгах үед дуудаж шалгавал зүгээр байх.
                
                $this->logger->info("ALL USER SESSION:: ".var_export( $session->all(), true));
                $this->logger->info("SESSION. ID=".$session->getId());
            }
        }
        
        $entityManager = $doctrine->getManager();
        $repository = $entityManager->getRepository(CountryName::class);
        $repoResult = $repository->getCountryList();

        $this->logger->info("REPO RESULT:: ".var_export($repoResult, true));

        if ($repoResult) {
            $result = array(
                'result' => $repoResult
            );
        }else{
            $result = array(
                'result' => null,
            );
        }
        
        $this->logger->info($this->util->generateLogMessage($tagName, $logId, $logStep, 'END'));
        
        // return $this->render('base.html.twig', $result);
        return $this->json($result);
    }
    
    
    /**
     * @Route("/country/list", name="get_country_list")
     */
    public function getCountryList()
    {
        $this->logger->info('================================================');
        $request = Request::createFromGlobals();
        
        $logStep = 0;
        $tagName = 'get_country_list()';
        $logId = 'client_ip='.$request->getClientIp();
        
        $this->logger->info($this->util->generateLogMessage($tagName, $logId, $logStep, 'START'));
        
        $countryNameResult = $this->connection->fetchAllAssociative('
            SELECT *
                FROM country_name
                ORDER BY id ASC
            ');
        
        $this->logger->info("COUNTRY LIST RESULT:: ".var_export($countryNameResult, true));

        if ($countryNameResult) {
            $result = array(
                'countryNameList' => $countryNameResult,
            );
        }else{
            $result = array(
                'countryNameList' => null,
            );
        }
        
        $this->logger->info($this->util->generateLogMessage($tagName, $logId, $logStep, 'END'));
        
        return $this->json($result);
    }

    /**
     * @Route("/get/city", name="get_city")
     */
    public function getCity(ManagerRegistry $doctrine)
    {
        $request = Request::createFromGlobals();
        
        $response = json_decode($request->getContent(), true);
        $request->request->replace(is_array($response) ? $response : array());
        $country_id = $response['country_id'];
        $is_one_item = $response['is_one_item'];

        $logStep = 0;
        $tagName = 'get_city->getCity(CountryID = '.$country_id.')';
        $logId = 'client_ip='.$request->getClientIp();
        
        $this->logger->info($this->util->generateLogMessage($tagName, $logId, $logStep, 'START'));
        
        $entityManager = $doctrine->getManager();
        $repository = $entityManager->getRepository(CityName::class);
        $repoResult = $repository->getCityList($country_id);
        
        $this->logger->info("REPO RESULT:: ".var_export($repoResult, true));

        if ($repoResult) {
            $result = array(
                'result' => $repoResult,
                'is_one_item' => $is_one_item
            );
        }else{
            $result = array(
                'result' => null,
                'is_one_item' => $is_one_item
            );
        }
        
        $this->logger->info($this->util->generateLogMessage($tagName, $logId, $logStep, 'END'));
        
        return $this->json($result);
        // return $this->render('main/_city_list.html.twig', $result);
    }
    
    /**
     * @Route("/city/list", name="get_city_list")
     */
    public function getCityList()
    {
        $this->logger->info('================================================');
        $request = Request::createFromGlobals();
        
        $logStep = 0;
        $tagName = 'get_city_list()';
        $logId = 'client_ip='.$request->getClientIp();
        
        $this->logger->info($this->util->generateLogMessage($tagName, $logId, $logStep, 'START'));
        
        $countryId = $request->get('country_id');
        $this->logger->info($this->util->generateLogMessage($tagName, $logId, $logStep, 'PARAMETER::COUNTRY ID='.$countryId));
        
        $cityResult = $this->connection->fetchAllAssociative('
            SELECT *
                FROM city_name
                where country_id='.$countryId.'
                ORDER BY id ASC
            ');
        
        $this->logger->info("CITY RESULT:: ".var_export($cityResult, true));

        if ($cityResult) {
            $result = array(
                'cityNames' => $cityResult,
            );
        }else{
            $result = array(
                'cityNames' => null,
            );
        }
        
        $this->logger->info($this->util->generateLogMessage($tagName, $logId, $logStep, 'END'));
        
        return $this->json($result);
    }
    
    /**
     * @Route("/get/banner", name="get_banner")
     */
    public function getBannerList()
    {
        $request = Request::createFromGlobals();
        
        $response = json_decode($request->getContent(), true);
        $request->request->replace(is_array($response) ? $response : array());
        $is_special = $response['is_special'];
        $is_active = $response['is_active'];
        
        $logStep = 0;
        $tagName = 'get_banner(isSpecial = '.$is_special.')';
        $logId = 'client_ip='.$request->getClientIp();
        
        $this->logger->info($this->util->generateLogMessage($tagName, $logId, $logStep, 'START'));

        // $entityManager = $doctrine->getManager();
        // $repository = $entityManager->getRepository(HotelPhoto::class);
        // $hotelResult = $repository->getSpecialHotelPhoto($is_special, $is_active);

        $queryResult = $this->connection->fetchAllAssociative('
            SELECT t.id as trip_id, p.hotel_img, t.is_special, t.hotel_list_id as hotel_id 
                FROM trip_package as t
                INNER JOIN hotel_photo as p 
                ON( p.hotel_list_id = t.hotel_list_id)
                WHERE t.is_special = '.$is_special.'
                GROUP BY t.id 
                ORDER by t.id DESC
            ');
        
        
        $this->logger->info("SPECIAL HOTEL PHOTO RESULT:: ".var_export($queryResult, true));

        if ($queryResult) {
            $result = array(
                'result' => $queryResult
            );
        }else{
            $result = array(
                'result' => null
            );
        }
        
        $this->logger->info($this->util->generateLogMessage($tagName, $logId, $logStep, 'END'));
        
        return $this->json($result);
    }
    
     /**
     * @Route("/date/list", name="get_date_list")
     */
    public function getDateList()
    {
        $this->logger->info('================================================');
        $request = Request::createFromGlobals();
        
        $logStep = 0;
        $tagName = 'get_date_list()';
        $logId = 'client_ip='.$request->getClientIp();
        
        $this->logger->info($this->util->generateLogMessage($tagName, $logId, $logStep, 'START'));
        
        $country_id = $request->get('country_id');
        $city_id = $request->get('city_id');
        $this->logger->info($this->util->generateLogMessage($tagName, $logId, $logStep, 'PARAMETER::COUNTRY ID='.$country_id.', CITY ID='.$city_id));
        
//            SELECT DATE_FORMAT(departure_datetime, "%Y-%m-%d") as start_date 
//                FROM flight_info
//                WHERE country_id='.$country_id.' and city_id='.$city_id.'
//                GROUP BY departure_datetime
//                ORDER by departure_datetime ASC
                            
        $dateResult = $this->connection->fetchAllAssociative('
            SELECT DATE_FORMAT(departure_datetime, "%Y-%m-%d") as start_date 
                FROM flight_info as flight 
                INNER JOIN trip_package as trip 
                INNER JOIN hotel_list as hotel 
                INNER JOIN room_price as room 
                INNER JOIN hotel_photo as photo  

                ON(
                trip.flight_info_id=flight.id AND
                hotel.id=trip.hotel_list_id AND photo.hotel_list_id=trip.hotel_list_id
                )

                WHERE flight.country_id='.$country_id.' and flight.city_id='.$city_id.'
                and room.trip_id = trip.id 
                and photo.is_active=2 
                and photo.is_special=0
                and trip.is_active=1
                GROUP BY flight.departure_datetime
                ORDER by flight.departure_datetime ASC
            ');
        
        $this->logger->info("DATE RESULT:: ".var_export($dateResult, true));

        if ($dateResult) {
            $result = array(
                'dateList' => $dateResult,
            );
        }else{
            $result = array(
                'dateList' => null,
            );
        }
        
        $this->logger->info($this->util->generateLogMessage($tagName, $logId, $logStep, 'END'));
        
        return $this->json($result);
    }


    // ######### FOR REACTJS ROUTE REGISTRATION FOR BROWSER REFRESHING PAGE #########

    /**
     * @Route("/", name="reactMain")
     */
    public function reactMain()
    {
        return $this->render('base.html.twig');
    }

    /**
     * @Route("/home", name="reactHome")
     */
    public function reactHome()
    {
        return $this->render('base.html.twig');
    }

    /**
     * @Route("/advise", name="reactAdvise")
     */
    public function reactAdvise()
    {
        return $this->render('base.html.twig');
    }

    /**
     * @Route("/address", name="reactAddress")
     */
    public function reactAddress()
    {
        return $this->render('base.html.twig');
    }

    /**
     * @Route("/hotels/{city_id}/{country_id}", name="reactHotelList")
     */
    public function reactHotelList()
    {
        return $this->render('base.html.twig');
    }

    /**
     * @Route("/hotels/{city_id}/{country_id}/{date}", name="reactHotelList2")
     */
    public function reactHotelList2()
    {
        return $this->render('base.html.twig');
    }

    /**
     * @Route("/hotel/{hotel_id}/{trip_id}/{is_special}", name="reactHotelDetail")
     */
    public function reactHotelDetail()
    {
        return $this->render('base.html.twig');
    }

    /**
     * @Route("/rooms/{trip_id}/{hotel_id}/{is_special}/{adult_count}/{children_count}/{children_age}", name="react_room_list")
     */
    public function reactRoomList()
    {
        return $this->render('base.html.twig');
    }

    /**
     * @Route("/photo/{param}", name="react_photo")
     */
    public function reactPhoto()
    {
        return $this->render('base.html.twig');
    }
    
    /**
     * @Route("/orders", name="reactOrder")
     */
    public function reactOrder()
    {
        return $this->render('base.html.twig');
    }
    
    /**
     * @Route("/orders/{order_id}", name="reactOrderDetail")
     */
    public function reactOrderDetail()
    {
        return $this->render('base.html.twig');
    }
    
    /**
     * @Route("/confirm/{param}", name="reactConfirm")
     */
    public function reactConfirm()
    {
        return $this->render('base.html.twig');
    }

    /**
     * @Route("/result", name="reactResult")
     */
    public function reactResult()
    {
        return $this->render('base.html.twig');
    }
    

}
